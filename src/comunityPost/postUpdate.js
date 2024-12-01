const Joi = require("joi");
const pool = require("../database");

// Validasi schema menggunakan Joi
const validatePostSchema = Joi.object({
  post_id: Joi.number().required(),
  title: Joi.string().max(100).optional(),
  content: Joi.string().max(1000).optional(),
  category: Joi.string().optional(),
  location: Joi.object({
    name: Joi.string().optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
  }).optional(),
});

const updatePostHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;

  // Validasi body menggunakan Joi
  const { payload } = request;
  const { error } = validatePostSchema.validate(payload);

  if (error) {
    return h
      .response({
        status: "fail",
        message: "Kontak yang Anda masukkan salah",
      })
      .code(400);
  }

  const { post_id, title, content, category, location } = payload;

  try {
    // Check apakah post_id ada
    const [postExists] = await pool.query(
      "SELECT * FROM posts WHERE post_id = ? AND user_id = ?",
      [post_id, userId]
    );
    if (postExists.length === 0) {
      return h
        .response({
          status: "fail",
          message: "Postingan tidak ditemukan",
        })
        .code(400);
    }

    // Update lokasi jika ada
    let location_id = postExists[0].location_id;
    if (location) {
      const [locationResult] = await pool.query(
        "INSERT INTO maps (location_name, latitude, longitude) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE location_name = VALUES(location_name), latitude = VALUES(latitude), longitude = VALUES(longitude)",
        [location.name, location.latitude, location.longitude]
      );
      location_id = locationResult.insertId || location_id;
    }

    // Update postingan
    await pool.query(
      "UPDATE posts SET title = ?, content = ?, category = ?, location_id = ?, updated_at = NOW() WHERE post_id = ? AND user_id = ?",
      [
        title || postExists[0].title,
        content || postExists[0].content,
        category || postExists[0].category,
        location_id,
        post_id,
        userId,
      ]
    );

    return h
      .response({
        status: "success",
      })
      .code(201);
  } catch (err) {
    console.error(err);
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

module.exports = { updatePostHandler };
