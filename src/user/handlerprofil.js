const pool = require('../database');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'some_shared_secret';

// Handler untuk mendapatkan profil pengguna
const getProfileHandler = async (request, h) => {
    const authorizationHeader = request.headers['authorization'];

    // Cek apakah ada Authorization header
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return h.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses',
        }).code(401);
    }

    const token = authorizationHeader.replace('Bearer ', '');

    // Verifikasi token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses',
        }).code(401);
    }

    // Pastikan user_id ada dalam token
    if (!decodedToken.user_id) {
        return h.response({
            status: 'fail',
            message: 'Token tidak valid',
        }).code(401);
    }

    // Ambil data pengguna berdasarkan user_id di token
    try {
        const query = 'SELECT name, profile_photo, phone_number, email FROM users WHERE id = ?';
        const [rows] = await pool.execute(query, [decodedToken.user_id]);

        // Cek apakah pengguna ditemukan
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
                profile_photo: user.profile_photo,
                phone_number: user.phone_number,
                email: user.email,
            },
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan pada server',
        }).code(500);
    }
};

module.exports = { getProfileHandler };
