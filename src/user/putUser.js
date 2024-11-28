const pool = require('../database');
const Joi = require('joi');

// Schema validasi menggunakan Joi
const schema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    profile_photo: Joi.string().uri().optional(),
    phone_number: Joi.string().min(10).max(15).optional(),
});

// Handler untuk memperbarui data pengguna
const updateUserHandler = async (request, h) => {
    const userId = request.auth.artifacts.decoded.payload.user.id
    const { name, profile_photo, phone_number } = request.payload;
  
        const { error } = schema.validate({ name, profile_photo, phone_number });
         if (error) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah',
        }).code(400);
    }

        const updateQuery = `
            UPDATE users 
            SET name = ?, profile_photo = ?, phone_number = ? 
            WHERE id = ?
        `;
        const result = await pool.query(updateQuery, [name, profile_photo, phone_number, userId]);

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Pengguna tidak ditemukan'
            }).code(404); 
        }

        return h.response({
            status: 'success',
        }).code(201);
};

module.exports = { updateUserHandler };