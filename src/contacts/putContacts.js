const pool = require('../database');
const Joi = require('joi');

const schema = Joi.object({
    contact_id: Joi.number().integer().required(),
    name: Joi.string().min(3).max(30).optional(),
    phone: Joi.string().min(10).max(15).optional(),
    email: Joi.string().email().optional(),
    message: Joi.string().max(255).optional(),
});

const updateContactsHandler = async (request, h) => {

    const userId = request.auth.artifacts.decoded.payload.user.id

    const { contact_id, name, phone, email, message } = request.payload;

    const { error } = schema.validate({ contact_id, name, phone, email, message });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah',
        }).code(400);
    }

    try {
        const [result] = await pool.query(
            'UPDATE contacts SET contact_name = ?, contact_phone = ?, contact_email = ?, message = ? WHERE id = ? AND user_id = ?',
            [name, phone, email, message, contact_id, userId]
        );

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