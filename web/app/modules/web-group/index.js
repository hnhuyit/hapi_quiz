'use strict';

const GroupsController = require('./controller/groups.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/groups',
        config: GroupsController.list
    });
    server.route({
        method: 'GET',
        path: '/group/{slug}',
        config: GroupsController.view
    });
    next();
};

exports.register.attributes = {
    name: 'web-group'
};