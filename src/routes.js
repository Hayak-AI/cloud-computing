// routes.js

const { registerHandler } = require('./auth/handler');
const { loginHandler } = require('./auth/loginhandler');
const { uploadProfilePhotoHandler } = require('./user/handler');
const { updateUserHandler } = require('./user/handlerupdate');
const { getProfileHandler } = require('./user/handlerprofil');


const routes = [
    {
        method: 'POST',
        path: '/register',
        handler: registerHandler
    },
    {
        method: 'POST',
        path: '/login', 
        handler: loginHandler 
    },
    {
        method: 'PUT',
        path: '/users',
        handler: updateUserHandler,  
        options: {
            auth: false,  
        }
    },
    {
        method: 'POST',  
        path: '/users/upload-profile-photo',
        handler: uploadProfilePhotoHandler,  
        options: {
            auth: false,  
            payload: {
                maxBytes: 1024 * 1024 * 5,  
                output: 'stream', 
                parse: true,
                multipart: true
            }
        }
    },
    {
        method: 'GET',
        path: '/users/me',
        handler: getProfileHandler,
        options: {
            auth: false,
        },
    },
];

module.exports = routes;
