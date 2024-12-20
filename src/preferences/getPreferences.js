const pool = require('../database');

const getPreferences = async (request, res) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;

  try {
    const query =
      'SELECT * FROM preferences WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1';
    const [rows] = await pool.execute(query, [userId]);

    return res
      .response({
        status: 'success',
        data: {
          voice_detection: Boolean(rows[0].voice_detection),
          dark_mode: Boolean(rows[0].dark_mode),
          voice_sensitivity: rows[0].voice_sensitivity,
        },
      })
      .code(200);
  } catch (error) {
    return res
      .response({
        status: 'fail',
        message: 'Terjadi kegagalan pada server',
      })
      .code(500);
  }
};

module.exports = { getPreferences };
