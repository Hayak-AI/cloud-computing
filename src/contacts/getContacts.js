const pool = require('../database');
const Joi = require('joi');

const getContactsHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;
  const { notify } = request.query;
  const { limit = 5, skip = 0 } = request.query;

  try {
    const limitInt = parseInt(limit, 10);
    const skipInt = parseInt(skip, 10);

    // Query untuk mendapatkan kontak darurat
    const query = 'SELECT * FROM contacts WHERE user_id = ? LIMIT ? OFFSET ?';
    const [rows] = await pool.query(query, [userId, limitInt, skipInt]);

    if (rows.length === 0) {
      return h
        .response({
          status: 'success',
          data: [],
        })
        .code(200);
    }

    // Format data kontak
    const contacts = rows.map((contact) => ({
      contact_id: contact.id,
      name: contact.contact_name,
      phone: contact.contact_phone,
      email: contact.contact_email,
      notify:
        notify === 'true'
          ? true
          : notify === 'false'
            ? false
            : contact.notify === 1,
      message: contact.message,
    }));

    return h
      .response({
        status: 'success',
        data: contacts,
      })
      .code(200);
  } catch (error) {
    console.error('Database query error:', error);
    return h
      .response({
        status: 'fail',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

module.exports = { getContactsHandler };
