const pool = require('../database');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Schema validasi menggunakan Joi
const schema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    profile_photo: Joi.string().uri().optional(),
    phone_number: Joi.string().min(10).max(15).optional(),
});

// Handler untuk memperbarui data pengguna
const updateUserHandler = async (request, h) => {
    const { name, profile_photo, phone_number } = request.payload;
    const token = request.headers.authorization?.split(' ')[1]; // Mengambil token dari header Authorization

    if (!token) {
        return h.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses'
        }).code(401); // Unauthorized jika tidak ada token
    }

    const { error } = schema.validate({ name, profile_photo, phone_number });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah',
        }).code(400);
    }

    try {
        // Verifikasi token untuk mendapatkan ID pengguna
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Query untuk memeriksa apakah token ada di database dan sesuai dengan user
        const tokenQuery = 'SELECT * FROM tokens WHERE token = ?';
        const [tokenResults] = await pool.query(tokenQuery, [token]);

        if (tokenResults.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Token tidak valid'
            }).code(401); // Unauthorized jika token tidak valid
        }

        const updateQuery = 'UPDATE users SET name = ?, profile_photo = ?, phone_number = ? WHERE id = ?';
        await pool.query(updateQuery, [name, profile_photo, phone_number, decoded.user.id]);

        return h.response({
            status: 'success',
            message: 'Data pengguna berhasil diperbarui'
        }).code(200);
    } catch (error) {
        console.error('Database query error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
};

module.exports = { updateUserHandler };