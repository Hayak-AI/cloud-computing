const pool = require('../database');
const Joi = require('joi');

const schema = Joi.object({
  voice_detection: Joi.boolean().required(),
  dark_mode: Joi.boolean().required(),
  voice_sensitivity: Joi.string().valid('low', 'medium', 'high').required(),
});

const putPreferences = async (req, res) => {
  const userId = req.auth.artifacts.decoded.payload.user.id;
  const { voice_detection, dark_mode, voice_sensitivity } = req.payload;

  const convertBoolToInt = (input) => {
    if (input) {
      return 1;
    }
    return 0;
  };

  // Validasi data dengan Joi
  const { error } = schema.validate({
    voice_detection,
    dark_mode,
    voice_sensitivity,
  });
  if (error) {
    return res
      .response({
        status: 'fail',
        message: error.details[0].message,
      })
      .code(400);
  }

  try {
    const query = `
        UPDATE preferences
        SET voice_detection = ?, dark_mode = ?, voice_sensitivity = ?
        WHERE user_id = ?
    `;
    const [result] = await pool.query(query, [
      convertBoolToInt(voice_detection),
      convertBoolToInt(dark_mode),
      voice_sensitivity,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return h
        .response({
          status: 'fail',
          message: 'User tidak dapat ditemukan',
        })
        .code(404);
    }

    return res
      .response({
        status: 'success',
        message: 'Preferensi berhasil disimpan',
      })
      .code(201);
  } catch (error) {
    console.error('Database query error:', error); // Debugging jika terjadi kesalahan
    return res
      .response({
        status: 'fail',
        message: 'Terjadi kegagalan pada server',
      })
      .code(500);
  }
};

module.exports = {
  putPreferences,
};
