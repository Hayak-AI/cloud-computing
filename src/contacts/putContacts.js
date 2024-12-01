const pool = require('../database');
const Joi = require('joi');

const schema = Joi.object({
  contact_id: Joi.number().required(),
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.string().min(10).max(15).required(),
  email: Joi.string().email().required(),
  message: Joi.string().max(255).required(),
  notify: Joi.boolean().optional(),
});

const updateContactsHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;
  const { contact_id, name, phone, email, message, notify } = request.payload;

  let notifyValue = notify;
  if (typeof notify === 'string') {
    notifyValue = notify.toLowerCase() === 'true';
  }

  const { error } = schema.validate({
    contact_id,
    name,
    phone,
    email,
    message,
    notify: notifyValue,
  });
  if (error) {
    return h
      .response({
        status: 'fail',
        message: 'Data yang Anda masukkan salah',
      })
      .code(400);
  }

  try {
    notifyValue = notifyValue === true ? 1 : 0;

    const [result] = await pool.query(
      'UPDATE contacts SET contact_name = ?, contact_phone = ?, contact_email = ?, message = ?, notify = ? WHERE id = ? AND user_id = ?',
      [name, phone, email, message, notifyValue, contact_id, userId],
    );

    if (result.affectedRows === 0) {
      return h
        .response({
          status: 'fail',
          message: 'Kontak tidak ditemukan atau Anda tidak memiliki akses',
        })
        .code(404);
    }

    return h
      .response({
        status: 'success',
        message: 'Kontak berhasil diperbarui',
      })
      .code(200);
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

module.exports = { updateContactsHandler };
