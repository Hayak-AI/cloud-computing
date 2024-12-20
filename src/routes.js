const { registerHandler } = require('./auth/register');
const { loginHandler } = require('./auth/login');
const { uploadProfilePhotoHandler } = require('./user/uploadPhotoProfile');
const { updateUserHandler } = require('./user/putUser');
const { getProfileHandler } = require('./user/getUser');
const { getPreferences } = require('./preferences/getPreferences');
const { putPreferences } = require('./preferences/putPreferences');
const { addContactsHandler } = require('./contacts/postContacts');
const { getContactsHandler } = require('./contacts/getContacts');
const { updateContactsHandler } = require('./contacts/putContacts');
const { deleteContactsHandler } = require('./contacts/deleteContacts');
const { getEmergenciesHandler } = require('./emergencies/getEmergencies');
const { postEmergenciesHandler } = require('./emergencies/postEmergencies');
const { postMapsReportHandler } = require('./maps/postMaps');
const { uploadEvidenceHandler } = require('./maps/uploadEvidence');
const { getMapsHandler } = require('./maps/getMaps');
const { deleteMapReportHandler } = require('./maps/delMaps');
const { forgotPasswordHandler } = require('./forgotpass/postPass');
const { resetPasswordHandler } = require('./forgotpass/putPass');
const { createPostHandler } = require('./comunityPost/createPost');
const { getPostHandler } = require('./comunityPost/postGet');
const { updatePostHandler } = require('./comunityPost/postUpdate');
const { deleteComPostHandler } = require('./comunityPost/postDelete');
const { getAllPostHandler } = require('./comunityPost/allpostGet');
const { addCommentHandler } = require('./communityComments/postComment');
const { updateEmailPasswordHandler } = require('./forgotpass/UpdateEmailPass');
const {
  getPostCommentsHandler,
  getReportCommentsHandler,
} = require('./communityComments/getComment');
const { deleteCommentHandler } = require('./communityComments/deleteComment');
const { getSafetyScore } = require('./news/getSafetyScore');

const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
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
        multipart: true,
      },
    },
  },
  {
    method: 'PUT',
    path: '/users',
    handler: updateUserHandler,
    options: {
      auth: 'jwt',
    },
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
    method: 'PUT',
    path: '/preferences',
    handler: putPreferences,
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
    path: '/comments',
    handler: addCommentHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'GET',
    path: '/post/{id}/comments',
    handler: getPostCommentsHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'POST',
    path: '/maps-report/upload-evidence',
    handler: uploadEvidenceHandler,
    options: {
      auth: 'jwt',
      payload: {
        maxBytes: 1024 * 1024 * 5,
        output: 'stream',
        parse: true,
        multipart: true,
      },
    },
  },
  {
    method: 'GET',
    path: '/report/{id}/comments',
    handler: getReportCommentsHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/comments',
    handler: deleteCommentHandler,
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
  },
  {
    method: 'POST',
    path: '/forgot-password',
    handler: forgotPasswordHandler,
  },
  {
    method: 'PUT',
    path: '/reset-password',
    handler: resetPasswordHandler,
  },
  {
    method: 'POST',
    path: '/posts',
    handler: createPostHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'GET',
    path: '/posts/{id}',
    handler: getPostHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'PUT',
    path: '/posts',
    handler: updatePostHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/posts',
    handler: deleteComPostHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'GET',
    path: '/posts',
    handler: getAllPostHandler,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'GET',
    path: '/news/{location}',
    handler: getSafetyScore,
    options: {
      auth: 'jwt',
    },
  },
  {
    method: 'PUT',
    path: '/update-email-password',
    handler: updateEmailPasswordHandler,
    options: {
      auth: 'jwt',
    },
  },
];

module.exports = routes;
