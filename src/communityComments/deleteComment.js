const pool = require('../database');
const Joi = require('joi');

const schema = Joi.object({
    comment_id: Joi.number().integer().required(),
});

const deleteCommentHandler = async (request, h) => {
    const userId = request.auth.artifacts.decoded.payload.user.id;
    const { payload } = request;
    if (!payload || !payload.comment_id) {
        return h.response({
            status: 'fail',
            message: 'Komentar yang Anda masukkan salah',
        }).code(400);
    }
    const { comment_id } = request.payload;

    const { error } = schema.validate({ comment_id });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Komentar yang Anda masukkan salah',
        }).code(400);
    }

    try {
        const [comment] = await pool.query(
            'SELECT * FROM comments WHERE comment_id = ? AND user_id = ?',
            [comment_id, userId]
        );

        if (comment.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Komentar tidak ditemukan atau Anda tidak memiliki akses',
            }).code(404);
        }

        await pool.query('DELETE FROM comments WHERE comment_id = ?', [comment_id]);

        return h.response({
            status: 'success',
        }).code(201);

    } catch (err) {
        console.error('Error deleting comment:', err);
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
        }).code(500);
    }
};

module.exports = { deleteCommentHandler };
