const jwt = require('jsonwebtoken');
const pool = require('../database');

/**
 * 
 * @param {*} req 
 * @param {import("hapi").ResponseToolkit} res 
 * @returns 
 */

const postPreferences = async (req, res) => {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses'
        }).code(401);
    }

    const token = authorizationHeader.replace('Bearer ', '');

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi JWT
    } catch (error) {
        return res.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses'
        }).code(401);
    }

    const { voice_detection, dark_mode, location_tracking } = req.payload;
    if (
        typeof voice_detection !== 'boolean' || 
        typeof dark_mode !== 'boolean' || 
        typeof location_tracking !== 'boolean'
    ) {
        return res.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah'
        }).code(400);
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
        }).code(201);
    } catch (error) {
        console.error(error); // Debugging jika terjadi kesalahan
        return res.response({
            status: 'fail',
            message: 'Terjadi kegagalan pada server'
        }).code(500);
    }
};

module.exports = {
    postPreferences
};
