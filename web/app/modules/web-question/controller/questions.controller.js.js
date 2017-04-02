'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const _ = require('lodash');
exports.list = {
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
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply.view('web-question/view/list',dataRes);
        });


    }
}
exports.view = {
    pre: [
        { method: getItem, assign: 'question' }
    ],
    handler: function(request, reply) {
        let question = request.pre.question;
        if (!question) {
            return reply(Boom.notFound('question is not be found'));
        }
        let meta = {}
        if(question.attrs && question.attrs.title){
            meta.title = question.attrs.title || question.title
            meta.description = question.attrs.description || question.title
        }
        return reply.view('web-question/view/view', { question: question, meta: meta });
    },
}

/**
 * Middleware
 */
function getItem(request, reply) {
    const slug = request.params.slug;
    let options = {
        slug: request.params.slug,
        status: 1
    };
    let promise = Question.findOne(options).exec();
    promise.then(function(question) {
        reply(question);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
