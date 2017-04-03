'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Qquestion = mongoose.model('Qquestion');
const _ = require('lodash');
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
        Qquestion.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'page'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    }
}
exports.edit = {
    pre: [
        { method: getById, assign: 'qquestion' }
    ],
    handler: function(request, reply) {
        const qquestion = request.pre.qquestion;
        if (qquestion) {
            return reply(qquestion);
        } else {
            reply(Boom.notFound('Qquestion is not found'));
        }
    },
    description: 'Get Qquestion',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        params: {
            id: Joi.string().required().description('ID'),
        }
    }
}

exports.save = {
    handler: function(request, reply) {
        let qquestion = new Qquestion(request.payload);
        let promise = qquestion.save();
        promise.then(function(qquestion) {
            reply(qquestion);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Qquestion',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
        status: Joi.number().allow('').description('Status'),
            desc: Joi.string().allow('').description('Desc'),
            created_at: Joi.date().allow('').description('Created At'),
            updated_at: Joi.date().allow('').description('Updated At'),
            
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: 'qquestion' }
    ],
    handler: function(request, reply) {
        let qquestion = request.pre.qquestion;
        
        qquestion = _.extend(qquestion, request.payload);
        let promise = qquestion.save();
        promise.then(function(qquestion) {
            reply(qquestion);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update Qquestion',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
        status: Joi.number().allow('').description('Status'),
            desc: Joi.string().allow('').description('Desc'),
            created_at: Joi.date().allow('').description('Created At'),
            updated_at: Joi.date().allow('').description('Updated At'),
            
            __v: Joi.any().optional().description('Version Key'),
            _id: Joi.string().required().description('MongoID')
        }
    }
}
exports.delete = {
    pre: [
        { method: getById, assign: 'qquestion' }
    ],
    handler: function(request, reply) {
        const qquestion = request.pre.qquestion;
        qquestion.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(qquestion);
        });
    },
    description: 'Delete Qquestion',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        params: {
            id: Joi.string().required().description('ID'),
        }
    }
}

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Qquestion.findOne({ '_id': id });
    promise.then(function(qquestion) {
        reply(qquestion);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply.continue();
    })


}
