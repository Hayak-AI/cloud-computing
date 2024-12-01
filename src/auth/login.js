const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database');
const Joi = require('joi');

// Schema validasi menggunakan Joi
const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

const loginHandler = async (request, h) => {
    const { email, password } = request.payload;

    // Validasi input menggunakan Joi
    const { error } = schema.validate({ email, password });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Email atau password salah',
        }).code(400);
    }

    const query = 'SELECT * FROM users WHERE email = ?';

    try {
        const [results] = await pool.query(query, [email]);

        if (results.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Email atau password salah',
            }).code(400);
        }

        const user = results[0];

        // Verifikasi password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return h.response({
                status: 'fail',
                message: 'Email atau password salah',
            }).code(400);
        }

        // Generate token
        const accessToken = jwt.sign(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            },
            process.env.JWT_SECRET,
        );

        return h.response({
            status: 'success',
            data: {
                access_token: accessToken,
            },
        }).code(200);

    } catch (error) {
        console.error('Database query error:', error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan pada server',
        }).code(500);
    }
};

module.exports = { loginHandler };