const express = require('express');
const controller = require('../controller/userController');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/api/user/user', controller.getUser);

    app.post('/api/user/update-email/:id', controller.updateEmail);
    app.post('/api/user/update-password/:id', controller.updatePassword);
    app.post('/api/user/forgot-password', controller.forgotPassword);
}