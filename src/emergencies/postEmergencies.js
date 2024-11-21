const pool = require('../database');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const schema = Joi.object({
    description: Joi.string().required(),
    location: Joi.object({
        name: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
    }).required(),
    evidence_url: Joi.string().uri().allow(null).optional(),
});

const postEmergenciesHandler = async (request, h) => {
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
            message: 'Token tidak valid',
        }).code(401);
    }

    const { error } = schema.validate(request.payload);
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses',
        }).code(400);
    }

    const { description, location, evidence_url} = request.payload;
    const { name, latitude, longitude } = location;

    try {
        const [mapResult] = await pool.query(
            'INSERT INTO maps (location_name, latitude, longitude) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude)',
            [name, latitude, longitude]
        );

        const location_id = mapResult.insertId || mapResult.id;

        await pool.query(
            'INSERT INTO reports (user_id, location_id, report_description, evidence_url) VALUES (?, ?, ?, ?)', // Perbaikan kolom di query
            [decodedToken.user.id, location_id, description, evidence_url] 
        );
        
        await pool.query(
            'INSERT INTO emergencies (user_id, location_id, emergency_status) VALUES (?, ?, ?)',
            [decodedToken.user.id, location_id, 'ongoing']
        );

        return h.response({
            status: 'success',
        }).code(201);
    } catch (error) {
        console.error('Database query error:', error);
        return h.response({
            status: 'error',
            message: 'Internal Error',
        }).code(500);
    }
};

module.exports = { postEmergenciesHandler };