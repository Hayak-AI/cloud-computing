const Joi = require('joi');
const bcrypt = require('bcrypt');
const pool = require('../database');

const updatePasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
});

const updatePasswordHandler = async (request, h) => {
    const userId = request.auth.artifacts.decoded.payload.user.id;

    const { email, oldPassword, newPassword } = request.payload;

    const { error } = updatePasswordSchema.validate({ email, oldPassword, newPassword });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Password gagal diperbarui',
        }).code(400);
    }

    try {
        // Cek apakah user_id ada di database
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (user.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Password gagal diperbarui',
            }).code(400);
        }

        const validPassword = await bcrypt.compare(oldPassword, user[0].password_hash);
        if (!validPassword) {
            return h.response({
                status: 'fail',
                message: 'Password gagal diperbarui',
            }).code(400);
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update email dan password di database
        const [result] = await pool.query('UPDATE users SET email = ?, password_hash = ?, updated_at = NOW() WHERE id = ?', [email, newPasswordHash, userId]);

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Password gagal diperbarui',
            }).code(400);
        }

        return h.response({
            status: 'success',
            message: 'Data berhasil diperbarui',
        }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan pada server',
        }).code(500);
    }
};

module.exports = { updatePasswordHandler };