require('dotenv').config();
const pool = require('../database');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const schema = Joi.object({
    authorization: Joi.string().required(),
});

const getProfileHandler = async (request, h) => {
    const authorizationHeader = request.headers['authorization']; 

    const { error } = schema.validate({ authorization});
    if (error) {
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
            message: 'Token tidak valid',
        }).code(401);
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decodedToken.user.id]);

    if (rows.length === 0) {
        return h.response({
            status: 'fail',
            message: 'Pengguna tidak ditemukan',
        }).code(404);
    }

    const user = rows[0];

    return h.response({
        status: 'success',
        data: {
            name: user.name,
            email: user.email,
            profile_photo: user.profile_photo,
            phone_number: user.phone_number
        },
    }).code(200);
};

module.exports = { getProfileHandler };