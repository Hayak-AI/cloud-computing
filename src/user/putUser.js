const pool = require('../database');
const jwt = require('jsonwebtoken');

// Handler untuk memperbarui data pengguna
const updateUserHandler = async (request, h) => {
    const { name, profile_photo, phone_number } = request.payload;
    const token = request.headers.authorization?.split(' ')[1]; // Mengambil token dari header Authorization

    if (!token) {
        return h.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses'
        }).code(401); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
        const tokenQuery = 'SELECT * FROM tokens WHERE token = ?';
        const [tokenResults] = await pool.query(tokenQuery, [token]);

        if (tokenResults.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Token tidak ditemukan atau tidak valid'
            }).code(401); 
        }

        if (!name || !profile_photo || !phone_number) {
            return h.response({
                status: 'fail',
                message: 'Data yang Anda masukkan salah'
            }).code(400); 
        }

        
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
            }).code(404); 
        }

        return h.response({
            status: 'success',
        }).code(201); 

    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Token tidak valid atau kadaluarsa'
        }).code(401); 
    }
};

module.exports = { updateUserHandler };
