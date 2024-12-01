const Joi = require('joi');
const nodemailer = require('nodemailer');
const pool = require('../database');
const jwt = require('jsonwebtoken');

const forgotPasswordHandler = async (request, h) => {
  const { email } = request.payload;

  // Validasi email menggunakan Joi
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate({ email });

  if (error) {
    return h
      .response({
        status: 'fail',
        message: 'Email yang Anda masukkan salah',
      })
      .code(400);
  }

  try {
    // Ambil user ID, name, dan email dari database berdasarkan email
    const [user] = await pool.query(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email],
    );

    if (!user || user.length === 0) {
      return h
        .response({
          status: 'fail',
          message: 'Email tidak ditemukan',
        })
        .code(404);
    }

    const { id: userId, name } = user[0];

    // Buat token yang berisi user ID, name, dan email
    const token = jwt.sign({ userId, name, email }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    // Konfigurasi transporter untuk nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
      },
    });

    // Kirim email dengan token reset password
    const mailOptions = {
      from: process.env.SMTP_EMAIL_USER,
      to: email,
      subject: 'Reset Password',
      text: `Here is your password reset token: ${token}`,
    };

    await transporter.sendMail(mailOptions);
    return h
      .response({
        status: 'success',
      })
      .code(200);
  } catch (err) {
    console.error('Error:', err);
    return h
      .response({
        status: 'fail',
        message: 'Gagal mengirim email',
      })
      .code(500);
  }
};

module.exports = { forgotPasswordHandler };
