const pool = require('../database');
const Joi = require('joi');

const schema = Joi.object({
  post_id: Joi.number().integer().required(),
});

const deleteComPostHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;

  const { post_id } = request.payload;

  // Validasi input menggunakan Joi
  const { error } = schema.validate({ post_id });
  if (error) {
    return h
      .response({
        status: 'fail',
        message: 'Postingan yang Anda masukkan salah',
      })
      .code(400);
  }

  try {
    const connection = await pool.getConnection();

    try {
      // Mulai transaksi
      await connection.beginTransaction();

      // Ambil `location_id` terkait post
      const [postResult] = await connection.query(
        'SELECT location_id FROM posts WHERE post_id = ? AND user_id = ?',
        [post_id, userId],
      );

      if (postResult.length === 0) {
        await connection.rollback();
        return h
          .response({
            status: 'fail',
            message: 'Postingan tidak ditemukan!',
          })
          .code(400);
      }

      const locationId = postResult[0].location_id;

      // Hapus data dari tabel `posts`
      const [deletePostResult] = await connection.query(
        'DELETE FROM posts WHERE post_id = ? AND user_id = ?',
        [post_id, userId],
      );

      if (deletePostResult.affectedRows === 0) {
        await connection.rollback();
        return h
          .response({
            status: 'fail',
            message: 'Gagal menghapus postingan',
          })
          .code(400);
      }

      // Hapus data dari tabel `maps` jika `location_id` valid
      if (locationId) {
        await connection.query('DELETE FROM maps WHERE id = ?', [locationId]);
      }

      // Commit transaksi
      await connection.commit();

      return h
        .response({
          status: 'success',
        })
        .code(201);
    } catch (error) {
      // Rollback transaksi jika terjadi kesalahan
      await connection.rollback();
      console.error('Transaction error:', error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

module.exports = { deleteComPostHandler };
