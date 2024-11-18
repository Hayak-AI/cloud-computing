const fs = require('fs');
const path = require('path');
const pool = require('../database');
const jwt = require('jsonwebtoken');

const uploadProfilePhotoHandler = async (request, h) => {
    const authorizationHeader = request.headers['authorization'];
    
    // Cek apakah ada Authorization header
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return h.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses'
        }).code(401);
    }

    const token = authorizationHeader.replace('Bearer ', '');

    // Verifikasi token secara manual
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi JWT secara manual
    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Anda tidak memiliki akses'
        }).code(401);
    }

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
    //     // Setelah file selesai di-upload, simpan URL ke database
    const imageUrl = `/uploads/${filename}`;

    //     // Misalnya kita simpan URL foto profil ke tabel users
    //     // const query = 'UPDATE users SET profile_photo = ? WHERE id = ?';
    //     // await pool.query(query, [imageUrl, decodedToken.user.id]);

    //     // Kembalikan response dengan URL gambar
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