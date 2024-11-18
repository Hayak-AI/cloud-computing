require('dotenv').config();
const pool = require('../database');
const jwt = require('jsonwebtoken');


// Handler untuk menambahkan kontak darurat
const addContactsHandler = async (request, h) => {
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
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Token tidak valid',
        }).code(401);
    }

    const { name, phone, email, message } = request.payload;

    // Cek apakah semua properti body request lengkap
    if (!name || !phone || !email || !message) {
        return h.response({
            status: 'fail',
            message: 'Kontak yang Anda masukkan salah',
        }).code(400);
    }

    // Simpan kontak darurat ke database
    try {
        await pool.query('INSERT INTO contacts (user_id, contact_name, contact_phone, contact_email, message) VALUES (?, ?, ?, ?, ?)', 
            [decodedToken.user.id, name, phone, email, message]);

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

module.exports = { addContactsHandler };