const pool = require('../database');

const getPostCommentsHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;
  if (!userId) {
    return h
      .response({
        status: 'fail',
        message: 'Anda tidak memiliki akses',
      })
      .code(401);
  }

  const postId = request.params.id;
  const { limit = 5, skip = 0 } = request.query;

  try {
    const [comments] = await pool.query(
      `SELECT c.comment_id, c.content, c.created_at,
            u.id as user_id, u.profile_photo, u.name, 
            c.post_id
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
          LIMIT ? OFFSET ?`,
      [postId, parseInt(limit), parseInt(skip)],
    );

    if (comments.length === 0) {
      return h
        .response({
          status: 'success',
          data: [],
        })
        .code(200);
    }

    let responseData = comments
      .filter((comment) => comment.post_id == postId)
      .map((comment) => ({
        post_id: postId,
        comment_id: comment.comment_id,
        content: comment.content,
        created_at: comment.created_at,
        user: {
          id: comment.user_id,
          profile_photo: comment.profile_photo,
          name: comment.name,
        },
        by_me: comment.user_id === userId,
      }));

    return h
      .response({
        status: 'success',
        data: responseData,
      })
      .code(200);
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

const getReportCommentsHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;
  if (!userId) {
    return h
      .response({
        status: 'fail',
        message: 'Anda tidak memiliki akses',
      })
      .code(401);
  }

  const reportId = request.params.id;
  const { limit = 5, skip = 0 } = request.query;

  try {
    const [comments] = await pool.query(
      `SELECT c.comment_id, c.content, c.created_at,
        u.id as user_id, u.profile_photo, u.name, 
        c.report_id
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.report_id = ?
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?`,
      [reportId, parseInt(limit), parseInt(skip)],
    );

    if (comments.length === 0) {
      return h
        .response({
          status: 'success',
          data: [],
        })
        .code(200);
    }

    let responseData = comments
      .filter((comment) => comment.report_id == reportId)
      .map((comment) => ({
        report_id: reportId,
        comment_id: comment.comment_id,
        content: comment.content,
        created_at: comment.created_at,
        user: {
          id: comment.user_id,
          profile_photo: comment.profile_photo,
          name: comment.name,
        },
        by_me: comment.user_id === userId,
      }));

    return h
      .response({
        status: 'success',
        data: responseData,
      })
      .code(200);
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

module.exports = { getPostCommentsHandler, getReportCommentsHandler };
