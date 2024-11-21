const pool = require('../database');

// Handler untuk memperbarui data pengguna
const updateUserHandler = async (request, h) => {
    const userId = request.auth.artifacts.decoded.payload.user.id
    
    const { name, profile_photo, phone_number } = request.payload;
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
        const result = await pool.query(updateQuery, [name, profile_photo, phone_number, userId]);

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Pengguna tidak ditemukan'
            }).code(404); 
        }

        return h.response({
            status: 'success',
        }).code(201);
};

module.exports = { updateUserHandler };
