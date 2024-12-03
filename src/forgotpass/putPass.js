const Joi = require('joi');
const jwt = require('jsonwebtoken');
const pool = require('../database');
const bcrypt = require('bcrypt');

const resetPasswordHandler = async (request, h) => {
  const { otp, password } = request.payload;

  // Validasi token dan password menggunakan Joi
  const schema = Joi.object({
    otp: Joi.number().integer().required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate({ otp, password });
  if (error) {
    return h
      .response({
        status: 'fail',
        message: 'Data yang Anda masukkan salah',
      })
      .code(400);
  }
  try {
    const [otpResult] = await pool.query('SELECT * FROM otp WHERE otp = ?', [
      otp,
    ]);
    if (otpResult.length === 0) {
      return h
        .response({
          status: 'fail',
          message: 'OTP tidak valid',
        })
        .code(400);
    }

    await pool.query('DELETE FROM otp WHERE otp = ?', [otp]);

    const { token } = otpResult[0];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password di database
    const [result] = await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, userId],
    );

    if (result.affectedRows === 0) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui password',
        })
        .code(500);
    }

    return h
      .response({
        status: 'success',
      })
      .code(201);
  } catch (err) {
    console.error(err);
    return h
      .response({
        status: 'fail',
        message: 'Token tidak valid atau terjadi kesalahan',
        error: err,
      })
      .code(400);
  }
};

module.exports = { resetPasswordHandler };
