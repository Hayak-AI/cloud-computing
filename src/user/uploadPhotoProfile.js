require('dotenv').config();
const path = require('path');
const Joi = require('joi');
const { Storage } = require('@google-cloud/storage');

const schema = Joi.object({
  file: Joi.object().required(),
});

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: path.resolve(__dirname, process.env.GCLOUD_KEY_FILENAME),
});

const bucketName = process.env.GCLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

const uploadProfilePhotoHandler = async (request, h) => {
  try {
    const userId = request.auth.artifacts.decoded.payload.user.id;
    const { file } = request.payload;

    const { error } = schema.validate({ file });
    if (error) {
      return h
        .response({
          status: 'fail',
          message: 'Gambar yang Anda masukkan salah',
        })
        .code(404);
    }

    const blob = bucket.file(
      `profile-photos/${userId}-${Date.now()}-${file.hapi.filename}`,
    );
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.hapi.headers['content-type'],
      },
    });

    const uploadPromise = new Promise((resolve, reject) => {
      file
        .pipe(blobStream)
        .on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
          resolve(publicUrl);
        })
        .on('error', (err) => {
          reject(err);
        });
    });

    const publicUrl = await uploadPromise;

    return h
      .response({
        status: 'success',
        data: { image_url: publicUrl },
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        status: 'fail',
        message: 'Terjadi kesalahan saat mengunggah foto profil',
      })
      .code(500);
  }
};

module.exports = { uploadProfilePhotoHandler };
