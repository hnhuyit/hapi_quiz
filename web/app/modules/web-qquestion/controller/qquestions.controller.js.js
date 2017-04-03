'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Qquestion = mongoose.model('Qquestion');
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
        Qquestion.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
            reply.view('web-qquestion/view/list',dataRes);
        });


    }
}
exports.view = {
    pre: [
        { method: getItem, assign: 'qquestion' }
    ],
    handler: function(request, reply) {
        let qquestion = request.pre.qquestion;
        if (!qquestion) {
            return reply(Boom.notFound('qquestion is not be found'));
        }
        let meta = {}
        if(qquestion.attrs && qquestion.attrs.title){
            meta.title = qquestion.attrs.title || qquestion.title
            meta.description = qquestion.attrs.description || qquestion.title
        }
        return reply.view('web-qquestion/view/view', { qquestion: qquestion, meta: meta });
    },
}

/**
 * Middleware
 */
function getItem(request, reply) {
    const _id = request.params._id;
    let options = {
        _id: request.params._id,
        status: 1
    };
    let promise = Qquestion.findOne(options).exec();
    promise.then(function(qquestion) {
        reply(qquestion);
    }).catch(function(err) {
        request.log(['error'], err);
        return reply(err);
    })
}
