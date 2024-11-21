const pool = require('../database');

const getProfileHandler = async (request, h) => {

const getProfileHandler = async (request, h) => {
    const userId = request.auth.artifacts.decoded.payload.user.id

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
        return h.response({
            status: 'fail',
            message: 'Pengguna tidak ditemukan',
        }).code(404);
    }

    const user = rows[0];

    return h.response({
        status: 'success',
        data: {
            name: user.name,
            email: user.email,
            profile_photo: user.profile_photo,
            phone_number: user.phone_number
        },
    }).code(200);
};

module.exports = { getProfileHandler };