const pool = require('../database');
const Joi = require('joi');

const schema = Joi.object({
  location: Joi.object({
    name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
  evidence_url: Joi.string().uri().optional(),
  description: Joi.string().required(),
});

const postMapsReportHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;

  // Validasi body request
  const { error } = schema.validate(request.payload);
  if (error) {
    return h
      .response({
        status: 'fail',
        message: 'Data yang Anda masukkan salah',
      })
      .code(400);
  }

  const { location, evidence_url, description } = request.payload;
  const { name, latitude, longitude } = location;

  try {
    const [locationResult] = await pool.query(
      `INSERT INTO maps (location_name, latitude, longitude) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude)`,
      [name, latitude, longitude],
    );

    const location_id = locationResult.insertId || locationResult.id;

    await pool.query(
      `INSERT INTO reports (user_id, location_id, report_description, evidence_url) 
             VALUES (?, ?, ?, ?)`,
      [userId, location_id, description, evidence_url],
    );

    return h
      .response({
        status: 'success',
      })
      .code(201);
  } catch (error) {
    console.error('Database query error:', error);
    return h
      .response({
        status: 'fail',
        message: 'Internal Error',
      })
      .code(500);
  }
};

module.exports = { postMapsReportHandler };
