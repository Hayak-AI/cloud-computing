const jwt = require('jsonwebtoken');
const pool = require('../database');

/**
 * 
 * @param {*} req 
 * @param {import("hapi").ResponseToolkit} res 
 * @returns 
 */
const getPreferences = async (req, res) => {
    const authorizationHeader = req.headers['authorization'];

    // Cek apakah ada Authorization header
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses'
        }).code(401);
    }

    const token = authorizationHeader.replace('Bearer ', '');

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
        console.log// Verifikasi JWT secara manual
    } catch (error) {
        return res.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses'
        }).code(401);
    }

    try {
        const query = 'SELECT * FROM preferences WHERE user_id = ?';
        const [rows] = await pool.execute(query, [decodedToken.user.id]);

        return res.response({
            status: 'success',
            data: {
                voice_detection: Boolean(rows[0].voice_detection),
                dark_mode: Boolean(rows[0].dark_mode),
                location_tracking: Boolean(rows[0].location_tracking
            )}
        }).code(200);
    } catch (error) {
        return res.response({
            status: 'fail',
            message: 'Terjadi kegagalan pada server'
        }).code(500);
    }

    

}

module.exports = {
    getPreferences
}