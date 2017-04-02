'use strict';

const SubjectsController = require('./controller/subjects.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/subjects',
        config: SubjectsController.list
    });
    server.route({
        method: 'GET',
        path: '/subject/{slug}',
        config: SubjectsController.view
    });
    next();
};

exports.register.attributes = {
    name: 'web-subject'
};