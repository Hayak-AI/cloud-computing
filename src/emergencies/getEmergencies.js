const pool = require('../database');
const jwt = require('jsonwebtoken');

const getEmergenciesHandler = async (request, h) => {
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

    //Ambil data emergency berdasarkan user_id yang ada dalam decodedToken
    try {
        const query = `
            SELECT 
                e.emergency_id, 
                e.emergency_status, 
                m.location_name, 
                m.latitude, 
                m.longitude, 
                r.report_description,
                r.evidence_url
            FROM 
                emergencies e
            JOIN 
                maps m ON e.location_id = m.id
            LEFT JOIN 
                reports r ON e.emergency_id = r.id
            WHERE 
                e.user_id = ? AND e.emergency_status = 'ongoing';
        `;

        const [rows] = await pool.execute(query, [decodedToken.user.id]);

        if (rows.length === 0) {
            return h.response({
                status: 'success',
                data: []
            }).code(200);  
        }

        const emergenciesData = rows.map(row => ({
            emergency_id: row.emergency_id,
            status: row.emergency_status,
            location: {
                name: row.location_name,
                latitude: row.latitude,
                longitude: row.longitude
            },
            description: row.report_description || '', 
            evidence_url: row.evidence_url || null 
        }));

        return h.response({
            status: 'success',
            data: emergenciesData
        }).code(200); 

    } catch (error) {
        console.error('Database query error:', error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan pada server'
        }).code(500); 
    }
};

module.exports = { getEmergenciesHandler };