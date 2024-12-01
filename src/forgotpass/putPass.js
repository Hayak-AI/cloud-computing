const Joi = require('joi');
const jwt = require('jsonwebtoken');
const pool = require('../database');
const bcrypt = require('bcrypt');

const resetPasswordHandler = async (request, h) => {
    const { token, password } = request.payload;

    // Validasi token dan password menggunakan Joi
    const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(8).required()
    });

    const { error } = schema.validate({ token, password });

    if (error) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah'
        }).code(400);
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decoded;

        // Hash password baru
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password di database
        const [result] = await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui password'
            }).code(500);
        }

        return h.response({
            status: 'success'
        }).code(201);
    } catch (err) {
        console.error(err);
        return h.response({
            status: 'fail',
            message: 'Token tidak valid atau terjadi kesalahan',
            error: err
        }).code(400);
    }
}

module.exports = { resetPasswordHandler };