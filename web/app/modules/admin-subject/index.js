'use strict';

const SubjectsController = require('./controller/subjects.controller.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;
    server.route({
        method: 'GET',
        path: '/subject',
        config: SubjectsController.getAll,
    });
    server.route({
        method: ['GET'],
        path: '/subject/{id}',
        config: SubjectsController.edit,

    });
    server.route({
        method: ['DELETE'],
        path: '/subject/{id}',
        config: SubjectsController.delete

    });
    server.route({
        method: 'POST',
        path: '/subject',
        config: SubjectsController.save,

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/subject/{id}',
        config: SubjectsController.update,

    });
    next();
};

exports.register.attributes = {
    name: 'admin-subject'
};
