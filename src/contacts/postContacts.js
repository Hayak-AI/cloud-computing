require('dotenv').config();
const pool = require('../database');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string().min(10).max(15).required(),
    email: Joi.string().email().required(),
    message: Joi.string().max(255).required(),
});

const addContactsHandler = async (request, h) => {
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return h.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses',
        }).code(401);
    }

    const token = authorizationHeader.replace('Bearer ', '');

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error("Token verification failed:", error);
        return h.response({
            status: 'fail',
            message: 'Token tidak valid',
        }).code(401);
    }

    const { name, phone, email, message } = request.payload;

    const { error } = schema.validate({ name, phone, email, message });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Kontak yang Anda masukkan salah',
        }).code(400);
    }

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