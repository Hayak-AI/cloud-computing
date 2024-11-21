require('dotenv').config();
const pool = require('../database');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const schema = Joi.object({
    contact_id: Joi.number().integer().required(),
    name: Joi.string().min(3).max(30).optional(),
    phone: Joi.string().min(10).max(15).optional(),
    email: Joi.string().email().optional(),
    message: Joi.string().max(255).optional(),
});

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

    const { error } = schema.validate({ contact_id, name, phone, email, message });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah',
        }).code(400);
    }

    try {
        const updateQuery = `
            UPDATE contacts 
            SET 
                contact_name = COALESCE(?, contact_name), 
                contact_phone = COALESCE(?, contact_phone), 
                contact_email = COALESCE(?, contact_email), 
                message = COALESCE(?, message)
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await pool.query(updateQuery, [name, phone, email, message, contact_id, decodedToken.user.id]);

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Kontak tidak ditemukan atau Anda tidak memiliki akses',
            }).code(404);
        }

        return h.response({
            status: 'success',
            message: 'Kontak darurat berhasil diperbarui',
        }).code(200);
    } catch (error) {
        console.error('Database query error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
        }).code(500);
    }
};

module.exports = { updateContactsHandler };