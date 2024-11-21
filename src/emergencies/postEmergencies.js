const pool = require('../database');

const markUserInDangerHandler = async (request, h) => {
    const userId = request.auth.artifacts.decoded.payload.user.id

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
            [userId, location_id, description, evidence_url] 
        );

        const emergencyResult = await pool.query(
            'INSERT INTO emergencies (user_id, location_id, emergency_status) VALUES (?, ?, ?)',
            [userId, location_id, 'ongoing']
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