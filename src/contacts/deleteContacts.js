const pool = require('../database');
const Joi = require('joi');

const schema = Joi.object({
    contact_id: Joi.number().integer().required(),
});

const deleteContactsHandler = async (request, h) => {

    const userId = request.auth.artifacts.decoded.payload.user.id

    const { contact_id } = request.payload;

    const { error } = schema.validate({ contact_id });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah',
        }).code(400);
    }

    try {
        const [result] = await pool.query(
            'DELETE FROM contacts WHERE id = ? AND user_id = ?',
            [contact_id, userId]
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

module.exports = { deleteContactsHandler };