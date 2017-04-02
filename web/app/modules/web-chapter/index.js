'use strict';

const ChaptersController = require('./controller/chapters.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/chapters',
        config: ChaptersController.list
    });
    server.route({
        method: 'GET',
        path: '/chapter/{slug}',
        config: ChaptersController.view
    });
    next();
};

exports.register.attributes = {
    name: 'web-chapter'
};