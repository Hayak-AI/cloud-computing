const pool = require('../database'); 
const bcrypt = require('bcrypt');

// Sign up/register
const registerHandler = async (request, h) => {
    const { name, email, password } = request.payload;

    // Validasi input
    if (!name || !email || !password) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah'
        }).code(400);
    }

    // Validasi format email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah'
        }).code(400);
    }

    // Validasi password minimal 8 karakter
    if (password.length < 8) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah'
        }).code(400);
    }

    try {
        // Memeriksa apakah email sudah terdaftar
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return h.response({
                status: 'fail',
                message: 'Email sudah terdaftar'
            }).code(400);
        }

        // Hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10);

        // Menyimpan pengguna baru ke database
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, provider, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [name, email, hashedPassword, 'local']  // Menambahkan provider 'local'
        );

        await pool.query('INSERT INTO preferences (user_id, created_at, updated_at, voice_detection, dark_mode, location_tracking) VALUES (?, NOW(), NOW(), false, false, false)', [result.insertId]);

        // Kembalikan respons sukses
        return h.response({
            status: 'success',
            message: 'Pendaftaran berhasil',
        }).code(200);

    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Gagal mendaftar, coba lagi nanti'
        }).code(500);
    }
};

module.exports = { registerHandler };
