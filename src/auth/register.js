const pool = require('../database');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

// Sign up/register
const registerHandler = async (request, h) => {
    const { name, email, password } = request.payload;

    const { error } = schema.validate({ name, email, password });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah',
        }).code(400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return h.response({
                status: 'fail',
                message: 'Email sudah terdaftar',
            }).code(400);
        }
        
        const [userRows] = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const userId = userRows.insertId;

        const preferencesQuery = `
            INSERT INTO preferences (user_id, voice_detection, dark_mode, location_tracking)
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(preferencesQuery, [
            userId,
            false, 
            false, 
            false  
        ]);

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

module.exports = { registerHandler };