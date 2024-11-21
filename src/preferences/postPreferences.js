const jwt = require('jsonwebtoken');
const pool = require('../database');
const Joi = require('joi');

/**
 * 
 * @param {*} req 
 * @param {import("hapi").ResponseToolkit} res 
 * @returns 
 */

const schema = Joi.object({
    authorization: Joi.string().pattern(/^Bearer\s.+$/).required(), // Validasi format header Authorization
    voice_detection: Joi.boolean().required(),
    dark_mode: Joi.boolean().required(),
    location_tracking: Joi.boolean().required(),
});

const postPreferences = async (req, res) => {
    const { authorization } = req.headers;
    const { voice_detection, dark_mode, location_tracking } = req.payload;

    // Validasi data dengan Joi
    const { error } = schema.validate({ authorization, voice_detection, dark_mode, location_tracking });
    if (error) {
        return res.response({
            status: 'fail',
            message: error.details[0].message,
        }).code(400);
    }

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses',
        }).code(401);
    }

    const token = authorization.replace('Bearer ', '');

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi JWT
    } catch (error) {
        return res.response({
            status: 'fail',
            message: 'Token tidak valid',
        }).code(401);
    }

    try {
        const query = `
            INSERT INTO preferences (user_id, voice_detection, dark_mode, location_tracking)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                voice_detection = VALUES(voice_detection),
                dark_mode = VALUES(dark_mode),
                location_tracking = VALUES(location_tracking)
        `;
        await pool.execute(query, [
            decodedToken.user.id,
            voice_detection,
            dark_mode,
            location_tracking,
        ]);

        return res.response({
            status: 'success',
            message: 'Preferensi berhasil disimpan',
        }).code(201);
    } catch (error) {
        console.error('Database query error:', error); // Debugging jika terjadi kesalahan
        return res.response({
            status: 'fail',
            message: 'Terjadi kegagalan pada server',
        }).code(500);
    }
};

module.exports = {
    postPreferences,
};