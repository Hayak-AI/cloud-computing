const pool = require('../database');

const getPostHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;

  const postId = request.params.id;

  try {
    // Query untuk mendapatkan postingan berdasarkan post_id
    const [postResult] = await pool.query(
      `SELECT p.post_id, p.title, p.content, p.category, p.created_at, p.updated_at, 
            u.id as user_id, u.name as user_name, u.profile_photo, 
            m.location_name, m.latitude, m.longitude,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) AS total_comments
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN maps m ON p.location_id = m.id
            WHERE p.post_id = ?`,
      [postId],
    );

    if (postResult.length === 0) {
      return h
        .response({
          status: 'success',
          message: [],
        })
        .code(200);
    }

    const post = postResult[0];

    const response = {
      status: 'success',
      data: {
        post_id: post.post_id,
        title: post.title,
        content: post.content,
        category: post.category,
        created_at: post.created_at,
        updated_at: post.updated_at,
        by_me: post.user_id === userId,
        user: {
          id: post.user_id,
          name: post.user_name,
          profile_photo: post.profile_photo,
        },
        location: post.location_name
          ? {
              name: post.location_name,
              latitude: post.latitude,
              longitude: post.longitude,
            }
          : null,
        total_comments: post.total_comments || 0,
      },
    };

    return h.response(response).code(200);
  } catch (err) {
    console.error('Error:', err);
    return h
      .response({
        status: 'fail',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

module.exports = { getPostHandler };
