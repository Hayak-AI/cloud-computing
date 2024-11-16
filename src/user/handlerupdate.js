const pool = require('../database');
const jwt = require('jsonwebtoken');

// Secret untuk JWT
const ACCESS_TOKEN_SECRET = 'some_shared_secret';

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

    try {
        // Verifikasi token untuk mendapatkan ID pengguna
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

        // Query untuk memeriksa apakah token ada di database dan sesuai dengan user
        const tokenQuery = 'SELECT * FROM tokens WHERE token = ?';
        const [tokenResults] = await pool.query(tokenQuery, [token]);

        if (tokenResults.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Token tidak ditemukan atau tidak valid'
            }).code(401); // Unauthorized jika token tidak ditemukan
        }

        // Memeriksa apakah properti body request lengkap dan valid
        if (!name || !profile_photo || !phone_number) {
            return h.response({
                status: 'fail',
                message: 'Data yang Anda masukkan salah'
            }).code(400); // Bad request jika data tidak lengkap
        }

        // Query untuk memperbarui data pengguna berdasarkan ID yang diambil dari token
        const updateQuery = `
            UPDATE users 
            SET name = ?, profile_photo = ?, phone_number = ? 
            WHERE id = ?
        `;
        const result = await pool.query(updateQuery, [name, profile_photo, phone_number, decoded.user.id]);

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Pengguna tidak ditemukan'
            }).code(404); // Not Found jika pengguna tidak ditemukan
        }

        return h.response({
            status: 'success',
        }).code(201); // Created jika berhasil memperbarui data pengguna

    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Token tidak valid atau kadaluarsa'
        }).code(401); // Unauthorized jika token tidak valid atau kadaluarsa
    }
};

module.exports = { updateUserHandler };
