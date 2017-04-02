'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
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
        Question.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list', 'page'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply(dataRes);
        });


    },
    description: 'List Question',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
        }
    },
}
exports.edit = {
    pre: [
        { method: getById, assign: 'question' }
    ],
    handler: function(request, reply) {
        const question = request.pre.question;
        if (question) {
            return reply(question);
        } else {
            reply(Boom.notFound('Question is not found'));
        }
    },
    description: 'Get Question',
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
        let question = new Question(request.payload);
        let promise = question.save();
        promise.then(function(question) {
            reply(question);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Question',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            name: Joi.string().required().description('Name'),
            slug: Joi.string().description('Slug'),
            question_type: Joi.string().required().description('Question Type'),
            level: Joi.string().required().description('Level'),
            description: Joi.string().description('Description'),
            no_time_corrected: Joi.number().description('No Time Corrected'),
            no_time_incorrected: Joi.number().description('No Time Incorrected'),
            no_time_unattempted: Joi.number().description('No Time Unattempted'),
            status: Joi.number().description('Status'),
            created: Joi.date().description('Created'),
            modified: Joi.date().description('Modified'),
            
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: 'question' }
    ],
    handler: function(request, reply) {
        let question = request.pre.question;
       
        question = _.extend(question, request.payload);
        let promise = question.save();
        promise.then(function(question) {
            reply(question);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update Question',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            responses: { '400': { 'description': 'Bad Request' } },
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            name: Joi.string().required().description('Name'),
            slug: Joi.string().description('Slug'),
            question_type: Joi.string().required().description('Question Type'),
            level: Joi.string().required().description('Level'),
            description: Joi.string().description('Description'),
            no_time_corrected: Joi.number().description('No Time Corrected'),
            no_time_incorrected: Joi.number().description('No Time Incorrected'),
            no_time_unattempted: Joi.number().description('No Time Unattempted'),
            status: Joi.number().description('Status'),
            created: Joi.date().description('Created'),
            modified: Joi.date().description('Modified'),
            
            __v: Joi.any().optional().description('Version Key'),
            _id: Joi.string().required().description('MongoID')
        }
    }
}
exports.delete = {
    pre: [
        { method: getById, assign: 'question' }
    ],
    handler: function(request, reply) {
        const question = request.pre.question;
        question.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(question);
        });
    },
    description: 'Delete Question',
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
    let promise = Question.findOne({ '_id': id });
    promise.then(function(question) {
        reply(question);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply.continue();
    })


}
