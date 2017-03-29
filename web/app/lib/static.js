'use strict'

const asset = require('../utils/asset');
const path = require('path');
// Declare internals
const internals = {};

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/modules/{module}/{file}',
        handler: function (request, reply) {
            let file = internals.helpers.getClientPath(request, reply);
            reply.file(file);
        },
        config: {
            auth: false
        }
    });
    server.route({
        method: 'GET',
        path: '/app/modules/{module}/view/client/{file*}',
        handler: function (request, reply) {
            let file = BASE_PATH + `/app/modules/${request.params.module}/view/client/${request.params.file}`;
            console.log('File: ' + file);
            reply.file(file);
        },
        config: {
            auth: false
        }
    });

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        },
        config: {
            auth: false
        }
    });


    const config = server.configManager.get('web');
    var assetsJs = asset.getAssets(config.assets.js, 'public/');
    var assetsCss = asset.getAssets(config.assets.css, 'public/');
    var assetsAdminJs = asset.getAssets(config.adminassets.js, 'public/');
    var assetsAdminCss = asset.getAssets(config.adminassets.css, 'public/');

    server.ext('onPreResponse', function (request, reply) {
        if (request.response.variety === 'view') {
            request.response.source.context = request.response.source.context || {};
            request.response.source.context.assets = {css: assetsCss, js: assetsJs}
            request.response.source.context.adminassets = {css: assetsAdminCss, js: assetsAdminJs}
        }

        reply.continue();
    });

    return next();
}
exports.register.attributes = {
    name: 'app-static',
    dependencies: 'inert'
};

internals.helpers = {
    getFileExt: function (fileName) {
        var fileExt = fileName.split(".");
        if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
            return "";
        }
        return fileExt.pop();
    },
    getClientPath: function(request, reply){
        let clients = {
            css : 'style',
            js  : 'js',
            html: 'template'
        };
        let file = request.params.file;
        let fileExt = this.getFileExt(file);
        let assetFolder = clients[fileExt];
        let filePath = path.join(BASE_PATH + '/app/modules',request.params.module, 'view', 'client', assetFolder, file );
        //console.log(filePath)
        return filePath;


    }
};