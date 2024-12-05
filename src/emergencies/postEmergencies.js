const pool = require('../database');
const Joi = require('joi');
const nodemailer = require('nodemailer');

const schema = Joi.object({
  description: Joi.string().required(),
  location: Joi.object({
    name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
  evidence_url: Joi.string().uri().allow(null).optional(),
});

const postEmergenciesHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;

  const { error } = schema.validate(request.payload);
  if (error) {
    return h
      .response({
        status: 'fail',
        message: 'Data Anda tidak valid',
        details: error.details[0].message,
      })
      .code(400);
  }

  const { description, location, evidence_url } = request.payload;
  const { name, latitude, longitude } = location;

  try {
    const [mapResult] = await pool.query(
      'INSERT INTO maps (location_name, latitude, longitude) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude)',
      [name, latitude, longitude],
    );

    const location_id = mapResult.insertId || mapResult.id;

    await pool.query(
      'INSERT INTO reports (user_id, location_id, report_description, evidence_url) VALUES (?, ?, ?, ?)', // Perbaikan kolom di query
      [userId, location_id, description, evidence_url],
    );

    const emergencyResult = await pool.query(
      'INSERT INTO emergencies (user_id, location_id, emergency_status) VALUES (?, ?, ?)',
      [userId, location_id, 'ongoing'],
    );

    // Fetch contacts with notify: true
    const [contacts] = await pool.query(
      'SELECT contact_name, contact_email, message FROM contacts WHERE notify = true AND user_id = ?',
      [userId],
    );

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
      },
    });

    // Send email to each contact
    contacts.forEach((contact) => {
      const mailOptions = {
        from: process.env.SMTP_EMAIL_USER,
        to: contact.contact_email,
        subject: 'Emergency Notification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 12px; background-color: #f9f9f9; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://storage.googleapis.com/hayak-ai-profile-picture/email/logo_bangkit-removebg-preview%5B1%5D.png" alt="Hayak.AI Logo" style="height: 50px; margin-bottom: 10px;" />
            <br>
            <h1 style="color: red; font-size: 24px; margin: 0; border: 2px solid red; display: inline-block; padding: 5px 10px;">Emergency Notification</h1>
          </div>
          <p style="color: #333;">Halo <strong>${contact.contact_name}</strong>,</p>
          <p style="color: #555;">Pesan dari ${name}: ${contact.message}</p>
          <div style="text-align: center; margin: 20px 0;">
            <p style="color: #555; font-weight: bold;">Saya dalam bahaya di sini:</p>
            <a href="https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
              <img src="https://img.icons8.com/ios-filled/50/ffffff/marker.png" alt="Map Icon" style="height: 24px; width: 24px; vertical-align: middle; margin-right: 8px;">
              <span style="vertical-align: middle;">Cek Disini</span>
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="color: #333; text-align: center; font-size: 14px;">Terima kasih,<br>Tim Support Hayak.AI</p>
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            &copy; 2024 Hayak.AI
          </div>
        </div>
      `,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Email sending error:', error);
        }
      });
    });

    return h
      .response({
        status: 'success',
        message: 'Emergency berhasil dikirim',
      })
      .code(201);
  } catch (error) {
    console.error('Database query error:', error);
    return h
      .response({
        status: 'error',
        message: 'Internal Error',
      })
      .code(500);
  }
};

module.exports = { postEmergenciesHandler };
