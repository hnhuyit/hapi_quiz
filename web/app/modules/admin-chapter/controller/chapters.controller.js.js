'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Chapter = mongoose.model('Chapter');
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
        Chapter.find(options).populate('subject_id').sort('id').paginate(page, itemsPerPage, function(err, items, total) {
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
        { method: getById, assign: 'chapter' }
    ],
    handler: function(request, reply) {
        const chapter = request.pre.chapter;
        if (chapter) {
            return reply(chapter);
        } else {
            reply(Boom.notFound('Chapter is not found'));
        }
    },
    description: 'Get Chapter',
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
        let chapter = new Chapter(request.payload);
        let promise = chapter.save();
        promise.then(function(chapter) {
            reply(chapter);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Created Chapter',
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
            desc: Joi.string().allow('').description('Desc'),
            slug: Joi.string().allow('').description('Slug'),
            status: Joi.number().allow('').description('Status'),
            subject_id: Joi.any().allow('').description('Subject'),
            created: Joi.date().allow('').description('Created'),
            modified: Joi.date().allow('').description('Modified'),
            
        }
    }
}
exports.update = {
    pre: [
        { method: getById, assign: 'chapter' }
    ],
    handler: function(request, reply) {
        let chapter = request.pre.chapter;
        
        chapter = _.extend(chapter, request.payload);
        let promise = chapter.save();
        promise.then(function(chapter) {
            reply(chapter);
        }).catch(function(err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    },
    description: 'Update Chapter',
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
            desc: Joi.string().allow('').description('Desc'),
            slug: Joi.string().allow('').description('Slug'),
            status: Joi.number().allow('').description('Status'),
            subject_id: Joi.any().allow('').description('Subject'),
            created: Joi.date().allow('').description('Created'),
            modified: Joi.date().allow('').description('Modified'),
            
            __v: Joi.any().optional().description('Version Key'),
            _id: Joi.string().required().description('MongoID')
        }
    }
}
exports.delete = {
    pre: [
        { method: getById, assign: 'chapter' }
    ],
    handler: function(request, reply) {
        const chapter = request.pre.chapter;
        chapter.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply(chapter);
        });
    },
    description: 'Delete Chapter',
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
    let promise = Chapter.findOne({ '_id': id }).populate('subject_id');
    promise.then(function(chapter) {
        reply(chapter);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply.continue();
    })


}
