const Joi = require('joi');
const nodemailer = require('nodemailer');
const pool = require('../database');
const jwt = require('jsonwebtoken');

const generateOTP = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

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

    // Menghasilkan OTP 5 digit yang unik
    let otp;
    let otpExists;
    do {
      otp = generateOTP();
      const [existingOtp] = await pool.query(
        'SELECT otp_id FROM otp WHERE otp = ?',
        [otp],
      );
      otpExists = existingOtp.length > 0;
    } while (otpExists);

    await pool.query('INSERT INTO otp (otp, token) VALUES (?, ?)', [
      otp,
      token,
    ]);

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
      text: `Kode OTP Anda adalah ${otp}. Kode ini berlaku selama 15 menit.`,
    };

    await transporter.sendMail(mailOptions);
    return h
      .response({
        status: 'success',
        message: 'OTP telah dikirim ke email Anda',
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
