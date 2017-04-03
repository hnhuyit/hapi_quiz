'use strict';

const QquestionsController = require('./controller/qquestions.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/qquestion',
        config: QquestionsController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/qquestion/{id}',
        config: QquestionsController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/qquestion/{id}',
        config: QquestionsController.delete

    });
    server.route({
        method: 'POST',
        path: '/qquestion',
        config: QquestionsController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/qquestion/{id}',
        config: QquestionsController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'api-qquestion'
};
