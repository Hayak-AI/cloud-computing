const Joi = require('joi');
const pool = require('../database');

const createPostHandler = async (request, h) => {
    const userId = request.auth.artifacts.decoded.payload.user.id

    try {
        const schema = Joi.object({
            title: Joi.string().max(100).required(),
            content: Joi.string().max(1000).required(),
            category: Joi.string().required(),
            location: Joi.object({
                name: Joi.string().optional(),
                latitude: Joi.number().optional(),
                longitude: Joi.number().optional()
            }).optional()
        });

        const { error } = schema.validate(request.payload);

        if (error) {
            return h.response({
                status: 'fail',
                message: 'Data yang Anda masukkan salah'
            }).code(400);
        }

        const { title, content, category, location } = request.payload;

        let locationId = null;
        if (location) {
            // Insert location into maps table
            const [locationResult] = await pool.query(
                'INSERT INTO maps (location_name, latitude, longitude) VALUES (?, ?, ?)',
                [location.name, location.latitude, location.longitude]
            );
            locationId = locationResult.insertId;
        }

        // Insert post into posts table
        await pool.query(
            'INSERT INTO posts (user_id, title, content, category, location_id) VALUES (?, ?, ?, ?, ?)',
            [userId, title, content, category, locationId]
        );

        return h.response({
            status: 'success'
        }).code(201);
    } catch (err) {
        console.error(err);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
}

module.exports = { createPostHandler };