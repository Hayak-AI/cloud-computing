const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database');

const loginHandler = async (request, h) => {
    const { email, password } = request.payload;

    // Validasi input
    if (!email || !password || password.length < 8) {
        return h.response({
            status: 'fail',
            message: 'Email atau password salah'
        }).code(400);
    }

    const query = 'SELECT * FROM users WHERE email = ?';

    try {
        const [results] = await pool.query(query, [email]);

        if (results.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Email atau password salah'
            }).code(400);
        }

        const user = results[0];

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return h.response({
                status: 'fail',
                message: 'Email atau password salah'
            }).code(400);
        }

        // Generate access token (JWT) dengan payload berisi data user
        const accessToken = jwt.sign(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            },
            process.env.JWT_SECRET 
        );


        // Simpan access token ke tabel tokens
        const tokenQuery = 'INSERT INTO tokens (token, created_at) VALUES (?, NOW(), ?)';
        await pool.query(tokenQuery, [accessToken]);

        
        return h.response({
            status: 'success',
            data: {
                access_token: accessToken,
            },
        }).code(200);

    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan di server',
        }).code(500);
    }
};

module.exports = { loginHandler };