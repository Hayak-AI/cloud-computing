const pool = require('../database');

const getAllPostHandler = async (request, h) => {
    const userId = request.auth.artifacts.decoded.payload.user.id
    const user_Id = request.params.id;

    try {
        // Query untuk mendapatkan postingan berdasarkan user_id
        const [postResult] = await pool.query(
            'SELECT p.post_id, p.title, p.content, p.category, p.created_at, p.updated_at, u.id as user_id, u.name as user_name, u.profile_photo, m.location_name, m.latitude, m.longitude ' +
            'FROM posts p ' +
            'JOIN users u ON p.user_id = u.id ' +
            'LEFT JOIN maps m ON p.location_id = m.id ' +
            'WHERE p.user_id = ?',
            [userId, user_Id]
        );

        if (postResult.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Postingan tidak ditemukan'
            }).code(404);
        }

        const posts = postResult.map(post => ({
            post_id: post.post_id,
            title: post.title,
            content: post.content,
            category: post.category,
            created_at: post.created_at,
            updated_at: post.updated_at,
            user: {
                id: post.user_id,
                name: post.user_name,
                profile_photo: post.profile_photo
            },
            location: post.location_name ? {
                name: post.location_name,
                latitude: post.latitude,
                longitude: post.longitude
            } : null
        }));

        const response = {
            status: 'success',
            data: posts
        };

        return h.response(response).code(200);
    } catch (err) {
        console.error('Error:', err);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan pada server'
        }).code(500);
    }
}

module.exports = { getAllPostHandler };