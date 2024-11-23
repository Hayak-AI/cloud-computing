const pool = require('../database');

const getMapsHandler = async (request, h) => {

    const userId = request.auth.artifacts.decoded.payload.user.id

    try {
        const [reports] = await pool.query(
            `SELECT r.id AS report_id, r.report_description AS description, r.evidence_url, r.verified,
                    l.location_name AS name, l.latitude, l.longitude
             FROM reports r
             JOIN maps l ON r.location_id = l.id
             WHERE r.user_id = ?`, [userId]
        );

        const formattedReports = reports.map(report => ({
            report_id: report.report_id,
            description: report.description,
            evidence_url: report.evidence_url,
            verified: report.verified,
            location: {
                name: report.name,
                latitude: parseFloat(report.latitude),
                longitude: parseFloat(report.longitude),
            }
        }));

        return h.response({
            status: 'success',
            data: formattedReports,
        }).code(201);
    } catch (error) {
        console.error('Database query error:', error);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
        }).code(500);
    }
};

module.exports = { getMapsHandler };