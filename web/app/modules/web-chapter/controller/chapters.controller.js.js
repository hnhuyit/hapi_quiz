'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Chapter = mongoose.model('Chapter');
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
        Chapter.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply.view('web-chapter/view/list',dataRes);
        });


    }
}
exports.view = {
    pre: [
        { method: getItem, assign: 'chapter' }
    ],
    handler: function(request, reply) {
        let chapter = request.pre.chapter;
        if (!chapter) {
            return reply(Boom.notFound('chapter is not be found'));
        }
        let meta = {}
        if(chapter.attrs && chapter.attrs.title){
            meta.title = chapter.attrs.title || chapter.title
            meta.description = chapter.attrs.description || chapter.title
        }
        return reply.view('web-chapter/view/view', { chapter: chapter, meta: meta });
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
    let promise = Chapter.findOne(options).exec();
    promise.then(function(chapter) {
        reply(chapter);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
