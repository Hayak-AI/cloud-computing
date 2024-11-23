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
const { postEmergenciesHandler } = require('./emergencies/postEmergencies');
const { postMapsReportHandler } = require('./maps/postMaps');
const { getMapsHandler } = require('./maps/getMaps');
const { deleteMapReportHandler } = require('./maps/delMaps');

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
            auth: 'jwt',  
        }
    },
    {
        method: 'POST',  
        path: '/users/upload-profile-photo',
        handler: uploadProfilePhotoHandler,  
        options: {
            auth: 'jwt',  
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
            auth: 'jwt',
        },
    },
    {
        method: 'GET',
        path: '/preferences',
        handler: getPreferences,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'POST',
        path: '/preferences',
        handler: postPreferences,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'POST',
        path: '/contacts',
        handler: addContactsHandler,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'GET',
        path: '/contacts',
        handler: getContactsHandler,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'PUT',
        path: '/contacts',
        handler: updateContactsHandler,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/contacts',
        handler: deleteContactsHandler,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'GET',
        path: '/emergencies',
        handler: getEmergenciesHandler,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'POST',
        path: '/emergencies',
        handler: postEmergenciesHandler,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'POST',
        path: '/maps-report',
        handler: postMapsReportHandler,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'GET',
        path: '/maps-report',
        handler: getMapsHandler,
        options: {
            auth: 'jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/maps-report',
        handler: deleteMapReportHandler,
        options: {
            auth: 'jwt',
        },
    }
];

module.exports = routes;
