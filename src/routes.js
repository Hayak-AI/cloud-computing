const { registerHandler } = require('./auth/register');
const { loginHandler } = require('./auth/login');
const { uploadProfilePhotoHandler } = require('./user/postUser');
const { updateUserHandler } = require('./user/putUser');
const { getProfileHandler } = require('./user/getUser');
const { getPreferences } = require('./preferences/getPreferences');
const { postPreferences } = require('./preferences/postPreferences');
const { addContactsHandler } = require('./contacts/postContacts');
const { getContactsHandler } = require('./contacts/getContacts');
const { updateContactsHandler } = require('./contacts/putContacts');
const { deleteContactsHandler } = require('./contacts/deleteContacts');
const { getEmergenciesHandler } = require('./emergencies/getEmergencies');
const { markUserInDangerHandler } = require('./emergencies/postEmergencies');

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
    {
        method: 'GET',
        path: '/preferences',
        handler: getPreferences,
        options: {
            auth: false,
        },
    },
    {
        method: 'POST',
        path: '/preferences',
        handler: postPreferences,
        options: {
            auth: false,
        },
    },
    {
        method: 'POST',
        path: '/contacts',
        handler: addContactsHandler,
        options: {
            auth: false,
        },
    },
    {
        method: 'GET',
        path: '/contacts',
        handler: getContactsHandler,
        options: {
            auth: false,
        },
    },
    {
        method: 'PUT',
        path: '/contacts',
        handler: updateContactsHandler,
        options: {
            auth: false,
        },
    },
    {
        method: 'DELETE',
        path: '/contacts',
        handler: deleteContactsHandler,
        options: {
            auth: false,
        },
    },
    {
        method: 'GET',
        path: '/emergencies',
        handler: getEmergenciesHandler,
        options: {
            auth: false,
        },
    },
    {
        method: 'POST',
        path: '/emergencies',
        handler: markUserInDangerHandler,
        options: {
            auth: false,
        },
    }
];

module.exports = routes;
