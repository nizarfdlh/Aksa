const express = require('express');
const controller = require('../controller/authUserController');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/api/auth/signup', controller.signUp);
    app.post('/api/auth/signin', controller.signIn);
    app.post('/api/auth/signout', controller.signOut);
}