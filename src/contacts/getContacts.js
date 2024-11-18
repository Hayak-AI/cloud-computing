require('dotenv').config();
const pool = require('../database');
const jwt = require('jsonwebtoken');

const getContactsHandler = async (request, h) => {
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return h.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses',
        }).code(401);
    }

    const token = authorizationHeader.replace('Bearer ', '');

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return h.response({
        status: 'fail',
        message: 'Anda tidak memiliki akses'
        }).code(401);
    }

    try {
        const query = 'SELECT * FROM contacts WHERE user_id = ?';
        const [rows] = await pool.execute(query, [decodedToken.user.id]);

        if (rows.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Tidak ada kontak darurat ditemukan',
            }).code(404);
        }

        // Kembalikan data dalam format yang sesuai
        const contacts = rows.map(contact => ({
            contact_id: contact.id,
            name: contact.contact_name,
            phone: contact.contact_phone,
            email: contact.contact_email,
            notify: contact.notify === 1, 
            message: contact.message,
        }));

        return h.response({
            status: 'success',
            data: contacts,
        }).code(200);
    } catch (error) {
        console.error('Database query error:', error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan pada server',
        }).code(500);
    }
};

module.exports = { getContactsHandler };
