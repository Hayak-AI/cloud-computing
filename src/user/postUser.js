const fs = require('fs');
const path = require('path');
const pool = require('../database');

const uploadProfilePhotoHandler = async (request, h) => {
    const userId = request.auth.artifacts.decoded.payload.user.id

    // Cek apakah file ada dalam request
    const file = request.payload.file;
    if (!file) {
        return h.response({
            status: 'fail',
            message: 'Gambar yang Anda masukkan salah'
        }).code(400);
    }

    // Cek apakah file yang di-upload adalah gambar
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = path.extname(file.hapi.filename).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
        return h.response({
            
        }).code(400);
    }

    // Menyimpan file ke dalam folder 'uploads'
    const filename = `${Date.now()}-${file.hapi.filename}`;
    const filePath = path.join(__dirname, '../..', 'uploads', filename);
    console.log(filePath)
    const writeStream = await fs.createWriteStream(filePath);
    file.pipe(writeStream);

    writeStream.on('finish', async () => {
    const imageUrl = `/uploads/${filename}`;

    });
    return h.response({
        status: 'success',
        data: {
            image_url: filePath// imageUrl
        }
    }).code(201);

    // Menangani error saat menulis file
    writeStream.on('error', (err) => {
        console.error('Error writing file:', err);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan saat mengunggah gambar'
        }).code(500);
    });
    
};

module.exports = { uploadProfilePhotoHandler };