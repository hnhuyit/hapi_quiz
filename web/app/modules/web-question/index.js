'use strict';

const QuestionsController = require('./controller/questions.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/questions',
        config: QuestionsController.list
    });
    server.route({
        method: 'GET',
        path: '/question/{slug}',
        config: QuestionsController.view
    });
    next();
};

exports.register.attributes = {
    name: 'web-question'
};