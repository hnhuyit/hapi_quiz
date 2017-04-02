'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Subject = mongoose.model('Subject');
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
        Subject.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply.view('web-subject/view/list',dataRes);
        });


    }
}
exports.view = {
    pre: [
        { method: getItem, assign: 'subject' }
    ],
    handler: function(request, reply) {
        let subject = request.pre.subject;
        if (!subject) {
            return reply(Boom.notFound('subject is not be found'));
        }
        let meta = {}
        if(subject.attrs && subject.attrs.title){
            meta.title = subject.attrs.title || subject.title
            meta.description = subject.attrs.description || subject.title
        }
        return reply.view('web-subject/view/view', { subject: subject, meta: meta });
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
    let promise = Subject.findOne(options).exec();
    promise.then(function(subject) {
        reply(subject);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
