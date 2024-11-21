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
    authorization: Joi.string().required(),
});

const getPreferences = async (req, res) => {
    const authorizationHeader = req.headers['authorization']; 

    const { error } = schema.validate({ authorization: authorizationHeader });
     if (error) {
        return res.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses',
        }).code(401);
    }

    const token = authorizationHeader.replace('Bearer ', '');

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
    } catch (error) {
        return res.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses'
        }).code(401);
    }

        const [rows] = await pool.query('SELECT * FROM preferences WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1', [decodedToken.user.id]);

        if (rows.length === 0) {
            return res.response({
                status: 'fail',
                message: 'Pengguna tidak ditemukan',
            }).code(404);
        }
    
        const preferences = rows[0];

        return res.response({
            status: 'success',
            data: {
                voice_detection: Boolean(rows[0].voice_detection),
                dark_mode: Boolean(rows[0].dark_mode),
                location_tracking: Boolean(rows[0].location_tracking)}
        }).code(200);
};

module.exports = {getPreferences}