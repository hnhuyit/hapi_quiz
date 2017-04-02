'use strict';

const QuizzesController = require('./controller/quizzes.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/quizzes',
        config: QuizzesController.list
    });
    server.route({
        method: 'GET',
        path: '/quiz/{slug}',
        config: QuizzesController.view
    });
    next();
};

exports.register.attributes = {
    name: 'web-quiz'
};