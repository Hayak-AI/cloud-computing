const pool = require('../database');

const getMapsHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;

  try {
    const [reports] = await pool.query(
      `SELECT r.id AS report_id, r.report_description AS description, r.evidence_url, r.verified,
                        l.location_name AS name, l.latitude, l.longitude, u.id AS user_id, u.name as user_name, u.profile_photo
                 FROM reports r
                 JOIN maps l ON r.location_id = l.id
                 JOIN users u ON r.user_id = u.id`,
    );

    const formattedReports = reports.map((report) => ({
      report_id: report.report_id,
      description: report.description,
      evidence_url: report.evidence_url,
      verified: Boolean(report.verified),
      location: {
        name: report.name,
        latitude: parseFloat(report.latitude),
        longitude: parseFloat(report.longitude),
      },
      user: {
        user_id: report.user_id,
        name: report.user_name,
        profile_photo: report.profile_photo,
      },
      by_me: report.user_id === userId,
    }));

    return h
      .response({
        status: 'success',
        data: formattedReports,
      })
      .code(201);
  } catch (error) {
    console.error('Database query error:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

module.exports = { getMapsHandler };