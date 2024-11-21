const fs = require('fs');
const path = require('path');
const pool = require('../database');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const schema = Joi.object({
    authorization: Joi.string().required(),
    file: Joi.object().required(),
});

const uploadProfilePhotoHandler = async (request, h) => {
    const { authorization } = request.headers;
    const { file } = request.payload;
    
const { error } = schema.validate({ authorization, file });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah',
        }).code(400);
    }

    // Cek apakah ada Authorization header
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return h.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses',
        }).code(401);
    }

    const token = authorization.replace('Bearer ', '');

    // Verifikasi token secara manual
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Token tidak valid',
        }).code(401);
    }

    const { id } = decodedToken.user;
    const fileExtension = path.extname(file.hapi.filename);
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

    if (!allowedExtensions.includes(fileExtension)) {
        return h.response({
            status: 'fail',
            message: 'Ekstensi file tidak diizinkan',
        }).code(400);
    }

    // Menyimpan file ke dalam folder 'uploads'
    const filename = `${Date.now()}-${file.hapi.filename}`;
    const filePath = path.join(__dirname, '../..', 'uploads', filename);
    console.log(filePath)
   const writeStream = fs.createWriteStream(filePath);
    file.pipe(writeStream);

    return new Promise((resolve, reject) => {
        writeStream.on('finish', async () => {
            // Setelah file selesai di-upload, simpan URL ke database
            const imageUrl = `/uploads/${filename}`;
            try {
                await pool.query('UPDATE users SET profile_photo = ? WHERE id = ?', [imageUrl, id]);
                resolve(h.response({
                    status: 'success',
                    data: {
                        imageUrl,
                    },
                }).code(200));
            } catch (error) {
                console.error('Database query error:', error);
                reject(h.response({
                    status: 'error',
                    message: 'Terjadi kesalahan pada server',
                }).code(500));
            }
        });

        writeStream.on('error', (error) => {
            console.error('File upload error:', error);
            reject(h.response({
                status: 'error',
                message: 'Terjadi kesalahan saat meng-upload file',
            }).code(500));
        });
    });
};

module.exports = { uploadProfilePhotoHandler };