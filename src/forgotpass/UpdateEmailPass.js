const Joi = require('joi');
const bcrypt = require('bcrypt');
const pool = require('../database');

const updateEmailSchema = Joi.object({
    email: Joi.string().email().required(),
});

const updatePasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
});

const updateEmailPasswordHandler = async (request, h) => {
    const userId = request.auth.artifacts.decoded.payload.user.id;
    const { email, oldPassword, newPassword } = request.payload;

    let error;
    if (email && !oldPassword && !newPassword) {
        // Validasi hanya email
        ({ error } = updateEmailSchema.validate({ email }));
    } else if (email && oldPassword && newPassword) {
        // Validasi email dan password
        ({ error } = updatePasswordSchema.validate({ email, oldPassword, newPassword }));
    } else {
        return h.response({
            status: 'fail',
            message: 'Permintaan tidak valid',
        }).code(400);
    }

    if (error) {
        return h.response({
            status: 'fail',
            message: 'Data tidak valid',
        }).code(400);
    }

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (user.length === 0) {
            return h.response({
                status: 'fail',
                message: 'User tidak ditemukan',
            }).code(404);
        }

        if (email && !oldPassword && !newPassword) {
            // Update email
            await pool.query('UPDATE users SET email = ? WHERE id = ?', [email, userId]);
            return h.response({
                status: 'success',
                message: 'Email berhasil diperbarui',
            }).code(200);
        } else if (email && oldPassword && newPassword) {
            // Update password
            const validPassword = await bcrypt.compare(oldPassword, user[0].password_hash);
            if (!validPassword) {
                return h.response({
                    status: 'fail',
                    message: 'Password lama tidak sesuai',
                }).code(400);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);
            return h.response({
                status: 'success',
                message: 'Password berhasil diperbarui',
            }).code(200);
        }
    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
        }).code(500);
    }
};

module.exports = { updateEmailPasswordHandler };