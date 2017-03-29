'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const Bcrypt = require('bcrypt');
const pagination = require('pagination');
const _ = require('lodash');
const crypto = require('crypto');
exports.getAll = {
    handler: function(request, reply) {
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
        let options = {};
        if (request.query.keyword && request.query.keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.title = re;
        }
        User.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'user'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });
    }
}


exports.changeStatus = {
    handler: function(request, reply) {

        User.update({ _id: request.params.id }, { $set: { status: request.params.status } }, function(err) {
            if (err) {
                return reply(Boom.forbidden("403"));
            }
        });
        return reply.redirect('/user/list');
    },
}

exports.edit = {
    pre: [
        { method: getById, assign: 'user' }
    ],
    handler: function(request, reply) {
        let user = request.pre.user;
        if (user) {
            return reply(user);
        } else {
            reply(Boom.notFound('User is not found'));
        }
    }
}

exports.save = {
    pre: [
        { method: getUserByEmail, assign: 'userByEmail' }
    ],
    handler: function(request, reply) {
        if (request.pre.userByEmail) {
            return reply(Boom.badRequest('Email taken'));
        }
        if (request.payload.password != request.payload.cfpassword) {
            return reply(Boom.badRequest('Confirm new password does not match'));
        }
        delete request.payload.cfpassword;

        let user = new User(request.payload);
        user.provider = 'local';
        user.hashPassword(request.payload.password, function(err, hash) {
            user.password = hash;
            // const token = crypto.randomBytes(20).toString('hex');
            // user.activeToken = token;
            const promise = user.save();
            promise.then(user => {
                user = user.toObject();
                delete user.password;
                //@TODOsend email welcome here
                return reply(user);
            }).catch(err => {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        });
    },
    validate: {
        payload: {
            name: Joi.string().required().description('Name'),
            email: Joi.string().email().required().description('Email'),
            password: Joi.string().description('Password'),
            cfpassword: Joi.string(),
            status: Joi.number().integer().min(0).max(1),
            roles: Joi.any().description('Roles')
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: 'user' }
    ],
    handler: function(request, reply) {
        let user = request.pre.user;
        if(!request.payload.password){
            delete request.payload.password;
        }else if(request.payload.password !== request.payload.cfpassword) {
            return reply(Boom.badRequest('Confirm new password does not match'));
        }
        delete request.payload.cfpassword;

        user = _.extend(user, request.payload);

        let saveUser = function(user){
            let promise = user.save();
            promise.then(function(user) {
                reply(user);
            }).catch(function(err) {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        }

        if (request.payload.password) {
            user.hashPassword(request.payload.password, function(err, hash) {
                user.password = hash;
                saveUser(user);

            });
        } else {
            saveUser(user);
        }


    },
    validate: {
        payload: {
            _id: Joi.string().description('MongoID'),
            name: Joi.string().required().description('Name'),
            email: Joi.string().email().required().description('Email'),
            password: Joi.string().description('Password'),
            cfpassword: Joi.string(),
            status: Joi.number().integer().min(0).max(1),
            roles: Joi.any().description('Roles')

        }
    }
}
exports.delete = {
    pre: [
        { method: getById, assign: 'user' }
    ],
    handler: function(request, reply) {
        const user = request.pre.user;
        user.remove((err) => {
            return reply(user);
        });
    }
}

/**
 * Middleware
 */



function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = User.findOne({ '_id': id });
    promise.then(function(user) {
        return reply(user);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply.continue();
    })
}

function getUserByEmail(request, reply) {

    const email = request.payload.email;
    User.findOne({ email: email }, function(err, user) {
        if (err) {
            request.log(['error'], err);
        }
        return reply(user);
    });
}

