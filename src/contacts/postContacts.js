require('dotenv').config();
const pool = require('../database');
const jwt = require('jsonwebtoken');


// Handler untuk menambahkan kontak darurat
const addContactsHandler = async (request, h) => {

    const userId = request.auth.artifacts.decoded.payload.user.id

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
            [userId, name, phone, email, message]);

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