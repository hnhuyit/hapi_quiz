'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Quiz = mongoose.model('Quiz');
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
        Quiz.find(options).populate('group_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
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
        { method: getById, assign: 'quiz' }
    ],
    handler: function(request, reply) {
        const quiz = request.pre.quiz;
        if (quiz) {
            return reply(quiz);
        } else {
            reply(Boom.notFound('Quiz is not found'));
        }
    },
    description: 'Get Quiz',
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
        let quiz = new Quiz(request.payload);
        let promise = quiz.save();
        promise.then(function(quiz) {
            reply(quiz);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Quiz',
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
            description: Joi.string().allow('').description('Description'),
            start_date: Joi.date().allow('').description('Start Date'),
            end_date: Joi.date().allow('').description('End Date'),
            duration: Joi.number().allow('').description('Duration'),
            maximum_attempts: Joi.number().allow('').description('Maximum Attempts'),
            pass_percentage: Joi.number().allow('').description('Pass Percentage'),
            group_id: Joi.any().allow('').description('Group'),
            view_answer: Joi.number().allow('').description('View Answer'),
            with_login: Joi.number().allow('').description('With Login'),
            number_of_question: Joi.number().required().description('Number Of Question'),
            slug: Joi.string().allow('').description('Slug'),
            status: Joi.number().allow('').description('Status'),
            created: Joi.date().allow('').description('Created'),
            modified: Joi.date().allow('').description('Modified'),
            
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: 'quiz' }
    ],
    handler: function(request, reply) {
        let quiz = request.pre.quiz;
        
        quiz = _.extend(quiz, request.payload);
        let promise = quiz.save();
        promise.then(function(quiz) {
            reply(quiz);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update Quiz',
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
            description: Joi.string().allow('').description('Description'),
            start_date: Joi.date().allow('').description('Start Date'),
            end_date: Joi.date().allow('').description('End Date'),
            duration: Joi.number().allow('').description('Duration'),
            maximum_attempts: Joi.number().allow('').description('Maximum Attempts'),
            pass_percentage: Joi.number().allow('').description('Pass Percentage'),
            group_id: Joi.any().allow('').description('Group'),
            view_answer: Joi.number().allow('').description('View Answer'),
            with_login: Joi.number().allow('').description('With Login'),
            number_of_question: Joi.number().required().description('Number Of Question'),
            slug: Joi.string().allow('').description('Slug'),
            status: Joi.number().allow('').description('Status'),
            created: Joi.date().allow('').description('Created'),
            modified: Joi.date().allow('').description('Modified'),
            
            __v: Joi.any().optional().description('Version Key'),
            _id: Joi.string().required().description('MongoID')
        }
    }
}
exports.delete = {
    pre: [
        { method: getById, assign: 'quiz' }
    ],
    handler: function(request, reply) {
        const quiz = request.pre.quiz;
        quiz.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(quiz);
        });
    },
    description: 'Delete Quiz',
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
    let promise = Quiz.findOne({ '_id': id }).populate('group_id');
    promise.then(function(quiz) {
        reply(quiz);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply.continue();
    })


}
