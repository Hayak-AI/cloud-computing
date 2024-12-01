const Joi = require("joi");
const pool = require("../database");

const deleteMapReportHandler = async (request, h) => {
  const userId = request.auth.artifacts.decoded.payload.user.id;

  const schema = Joi.object({
    report_id: Joi.number().integer().required(),
  });

  const { error, value } = schema.validate(request.payload);

  if (error) {
    return h
      .response({
        status: "fail",
        message: "Lokasi yang Anda masukkan salah",
      })
      .code(400);
  }

  const { report_id } = value;

  try {
    const [result] = await pool.query(
      "DELETE FROM reports WHERE id = ? AND user_id = ?",
      [report_id, userId]
    );

    if (result.affectedRows === 0) {
      return h
        .response({
          status: "fail",
          message: "Laporan tidak ditemukan",
        })
        .code(404);
    }

    return h
      .response({
        status: "success",
      })
      .code(201);
  } catch (error) {
    console.error("Database query error:", error);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan pada server",
      })
      .code(500);
  }
};

module.exports = { deleteMapReportHandler };
