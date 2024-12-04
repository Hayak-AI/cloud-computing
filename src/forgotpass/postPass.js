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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 12px; background-color: #f9f9f9; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://storage.googleapis.com/hayak-ai-profile-picture/email/logo_bangkit-removebg-preview%5B1%5D.png" alt="Hayak.AI Logo" style="height: 50px; margin-bottom: 10px;" />
            <h1 style="color: #007bff; font-size: 24px; margin: 0;">Reset Password</h1>
          </div>
            <p style="color: #333;">Halo <strong>${name}</strong>,</p>
            <p style="color: #555;">Anda telah meminta untuk mereset password Anda. Gunakan kode OTP berikut untuk mereset password Anda:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 28px; font-weight: bold; color: #007bff; padding: 10px 20px; border: 2px dashed #007bff; border-radius: 8px; background-color: #eef6ff;">${otp}</span>
          </div>
            <p style="color: #555;">Kode ini berlaku selama <strong>15 menit</strong>.</p>
            <p style="color: #555;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
            <p style="color: #333; text-align: center; font-size: 14px;">Terima kasih,<br>Tim Support Hayak.AI</p>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            &copy; 2024 Hayak.AI
          </div>
        </div>
       `,
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
