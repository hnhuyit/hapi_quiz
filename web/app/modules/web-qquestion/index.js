'use strict';

const QquestionsController = require('./controller/qquestions.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/qquestions',
        config: QquestionsController.list
    });
    server.route({
        method: 'GET',
        path: '/qquestion/{_id}',
        config: QquestionsController.view
    });
    next();
};

exports.register.attributes = {
    name: 'web-qquestion'
};