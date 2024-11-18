const pool = require('../database');
const jwt = require('jsonwebtoken');

const markUserInDangerHandler = async (request, h) => {
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

    const { description, location } = request.payload;
    const { name, latitude, longitude } = location;

    if (!description || !location || !name || !latitude || !longitude) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah',
        }).code(400);
    }

    const evidence_url = request.payload.evidence_url || null;

    try {
        const [mapResult] = await pool.query(
            'INSERT INTO maps (location_name, latitude, longitude) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude)',
            [name, latitude, longitude]
        );

        const location_id = mapResult.insertId || mapResult.id;

        const [reportResult] = await pool.query(
            'INSERT INTO reports (user_id, location_id, report_description, evidence_url) VALUES (?, ?, ?, ?)', // Perbaikan kolom di query
            [decodedToken.user.id, location_id, description, evidence_url] 
        );
        

        const emergencyResult = await pool.query(
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
            message: 'Terjadi kesalahan pada server',
        }).code(500);
    }
};

module.exports = { markUserInDangerHandler };