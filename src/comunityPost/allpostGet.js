const pool = require("../database");

const getAllPostHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;
  const from = request.query.from;

  try {
    let postResult;
    if (!from) {
      [postResult] = await pool.query(
        `SELECT p.post_id, p.title, p.content, p.category, p.created_at, p.updated_at, 
                u.id as user_id, u.name as user_name, u.profile_photo, 
                m.location_name, m.latitude, m.longitude, 
                COUNT(c.comment_id) as total_comments
         FROM posts p 
         JOIN users u ON p.user_id = u.id 
         LEFT JOIN maps m ON p.location_id = m.id 
         LEFT JOIN comments c ON p.post_id = c.post_id 
         GROUP BY p.post_id`
      );
    } else {
      if (from === "me") {
        [postResult] = await pool.query(
          `SELECT p.post_id, p.title, p.content, p.category, p.created_at, p.updated_at, 
                  u.id as user_id, u.name as user_name, u.profile_photo, 
                  m.location_name, m.latitude, m.longitude, 
                  COUNT(c.comment_id) as total_comments
           FROM posts p 
           JOIN users u ON p.user_id = u.id 
           LEFT JOIN maps m ON p.location_id = m.id 
           LEFT JOIN comments c ON p.post_id = c.post_id 
           WHERE p.user_id = ? 
           GROUP BY p.post_id`,
          [userId]
        );
      } else {
        [postResult] = await pool.query(
          `SELECT p.post_id, p.title, p.content, p.category, p.created_at, p.updated_at, 
            u.id as user_id, u.name as user_name, u.profile_photo, 
            m.location_name, m.latitude, m.longitude, 
            COUNT(c.comment_id) as total_comments
        FROM posts p 
        JOIN users u ON p.user_id = u.id 
        LEFT JOIN maps m ON p.location_id = m.id 
        LEFT JOIN comments c ON p.post_id = c.post_id 
        WHERE p.user_id = ? 
        GROUP BY p.post_id`,
        [from]
        );
      }
    }

    if (postResult.length === 0) {
      return h
        .response({
          status: "fail",
          message: "Postingan tidak ditemukan",
        })
        .code(404);
    }

    const posts = postResult.map((post) => ({
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
    }));

    const response = {
      status: "success",
      data: posts,
    };

    return h.response(response).code(200);
  } catch (err) {
    console.error("Error:", err);
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

module.exports = { getAllPostHandler };
