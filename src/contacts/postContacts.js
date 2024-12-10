const pool = require('../database');
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.string().min(10).max(15).required(),
  email: Joi.string().email().allow(null, '').optional(),
  message: Joi.string().max(255).required(),
});

const addContactsHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;

  const { name, phone, email, message } = request.payload;
  const { error } = schema.validate({ name, phone, email, message });

  if (error) {
    return h
      .response({
        status: 'fail',
        message: 'Kontak yang Anda masukkan salah',
        details: error?.details[0]?.message,
      })
      .code(400);
  }

  try {
    await pool.query(
      'INSERT INTO contacts (user_id, contact_name, contact_phone, contact_email, message) VALUES (?, ?, ?, ?, ?)',
      [userId, name, phone, email || null, message],
    );

    return h
      .response({
        status: 'success',
      })
      .code(201);
  } catch (error) {
    console.error('Database query error:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

module.exports = { addContactsHandler };
