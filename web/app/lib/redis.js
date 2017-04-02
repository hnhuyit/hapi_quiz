'use strict'
const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
exports.register = function (server, options, next) {

    var configManager = server.configManager;

    var settings = configManager.get('web.redisOptions');
    let client = redis.createClient(settings);
    client.on("error", function (err) {
        console.log("REDIS Error " + err);
    });
    server.on('stop', function () { // only one server.on('stop') listener
        console.log("REDIS STOP ");
        client.end(true);
        client.quit();
    });
    client.on("ready", function () {
        console.log("REDIS READY ");


    });
    client.on("connect", function () {
        console.log("REDIS CONNECT ");
    });
    server.decorate('server', 'redis', client);
    server.decorate('request', 'redis', client);
    server.expose('client', client);
    console.log('REGISTER REDIS');
    return next();




}
exports.register.attributes = {
    name: 'app-redis',
    dependencies: 'app-mongo'
};