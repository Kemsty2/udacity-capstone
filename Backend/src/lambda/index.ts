export const hello = require('./http/hello').hello

export const auth0Authorizer = require('./auth/auth0Authorizer').handler;

export const createTimer = require('./http/createTimer').handler;
export const deleteTimer = require('./http/deleteTimer').handler;
export const getTimers = require('./http/getTimers').handler;
export const updateTimer = require('./http/updateTimer').handler;

export const generateUploadUrl = require('./http/generateUploadUrl').handler;