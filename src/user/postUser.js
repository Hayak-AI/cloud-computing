const pool = require('../database');
const Joi = require('joi');

const schema = Joi.object({
    file: Joi.object().required(),
});

const uploadProfilePhotoHandler = async (request, h) => {
  
    const userId = request.auth.artifacts.decoded.payload.user.id  
  const { file } = request.payload;
    
const { error } = schema.validate({ file });
    if (error) {
        return h.response({
            status: 'fail',
            message: 'Data yang Anda masukkan salah',
        }).code(400);
    }
};

module.exports = { uploadProfilePhotoHandler };