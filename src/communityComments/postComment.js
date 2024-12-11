const pool = require('../database');
const Joi = require('joi');

const commentSchema = Joi.object({
  post_id: Joi.number().integer().optional(),
  report_id: Joi.number().integer().optional(),
  content: Joi.string().max(100).required(),
});

const addCommentHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;
  if (!userId) {
    return h
      .response({
        status: 'fail',
        message: 'Anda tidak memiliki akses',
      })
      .code(401);
  }

  const { post_id, report_id, content } = request.payload;

  // Validasi payload
  const { error } = commentSchema.validate({ post_id, report_id, content });
  if (error) {
    return h
      .response({
        status: 'fail',
        message: 'Data yang Anda masukkan salah',
        details: error?.details[0]?.message,
      })
      .code(400);
  }

  // Memastikan ada post_id atau report_id yang diisi
  if (!post_id && !report_id) {
    return h
      .response({
        status: 'fail',
        message: 'Anda harus memberikan post_id atau report_id',
      })
      .code(400);
  }

  try {
    // Menyimpan komentar ke database
    await pool.query(
      `INSERT INTO comments (post_id, report_id, user_id, content) 
             VALUES (?, ?, ?, ?)`,
      [post_id || null, report_id || null, userId, content],
    );

    return h
      .response({
        status: 'success',
      })
      .code(201);
  } catch (err) {
    console.error('Database query error:', err);

    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

module.exports = { addCommentHandler };
