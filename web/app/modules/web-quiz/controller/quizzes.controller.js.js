'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Quiz = mongoose.model('Quiz');
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
        Quiz.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply.view('web-quiz/view/list',dataRes);
        });


    }
}
exports.view = {
    pre: [
        { method: getItem, assign: 'quiz' }
    ],
    handler: function(request, reply) {
        let quiz = request.pre.quiz;
        if (!quiz) {
            return reply(Boom.notFound('quiz is not be found'));
        }
        let meta = {}
        if(quiz.attrs && quiz.attrs.title){
            meta.title = quiz.attrs.title || quiz.title
            meta.description = quiz.attrs.description || quiz.title
        }
        return reply.view('web-quiz/view/view', { quiz: quiz, meta: meta });
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
    let promise = Quiz.findOne(options).exec();
    promise.then(function(quiz) {
        reply(quiz);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
