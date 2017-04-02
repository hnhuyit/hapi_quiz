'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Group = mongoose.model('Group');
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
        Group.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply.view('web-group/view/list',dataRes);
        });


    }
}
exports.view = {
    pre: [
        { method: getItem, assign: 'group' }
    ],
    handler: function(request, reply) {
        let group = request.pre.group;
        if (!group) {
            return reply(Boom.notFound('group is not be found'));
        }
        let meta = {}
        if(group.attrs && group.attrs.title){
            meta.title = group.attrs.title || group.title
            meta.description = group.attrs.description || group.title
        }
        return reply.view('web-group/view/view', { group: group, meta: meta });
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
    let promise = Group.findOne(options).exec();
    promise.then(function(group) {
        reply(group);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
