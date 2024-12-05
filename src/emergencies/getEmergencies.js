const pool = require('../database');

const getEmergenciesHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;

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
                maps m ON m.id = e.location_id
            LEFT JOIN 
                reports r ON r.location_id = e.location_id
            WHERE 
                e.user_id = ? AND e.emergency_status = 'ongoing';
        `;

    const [rows] = await pool.execute(query, [userId]);

    if (rows.length === 0) {
      return h
        .response({
          status: 'success',
          data: [],
        })
        .code(200);
    }

    const emergenciesData = rows.map((row) => ({
      emergency_id: row.emergency_id,
      status: row.emergency_status,
      location: {
        name: row.location_name,
        latitude: row.latitude,
        longitude: row.longitude,
      },
      description: row.report_description || '',
      evidence_url: row.evidence_url || null,
    }));

    return h
      .response({
        status: 'success',
        data: emergenciesData,
      })
      .code(200);
  } catch (error) {
    console.error('Database query error:', error);
    return h
      .response({
        status: 'fail',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

module.exports = { getEmergenciesHandler };
