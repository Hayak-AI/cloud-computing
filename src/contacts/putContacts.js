require('dotenv').config();
const pool = require('../database');
const jwt = require('jsonwebtoken');

const updateContactsHandler = async (request, h) => {
    const authorizationHeader = request.headers['authorization'];

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
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Token tidak valid',
        }).code(401);
    }

    const { contact_id, name, phone, email, message } = request.payload;

    // Cek apakah semua properti body request lengkap
    if (!contact_id || !name || !phone || !email || !message) {
        return h.response({
            status: 'fail',
            message: 'Kontak yang Anda masukkan salah',
        }).code(400);
    }

    try {
        const [result] = await pool.query(
            'UPDATE contacts SET contact_name = ?, contact_phone = ?, contact_email = ?, message = ? WHERE id = ? AND user_id = ?',
            [name, phone, email, message, contact_id, decodedToken.user.id]
        );

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Kontak tidak ditemukan atau Anda tidak memiliki akses',
            }).code(404);
        }

        return h.response({
            status: 'success',
        }).code(201);
    } catch (error) {
        console.error('Database query error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
        }).code(500);
    }
};

module.exports = { updateContactsHandler };