'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Subject = mongoose.model('Subject');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');
exports.list = {
    // auth: {
    //     strategy: 'jwt',
    //     // scope: ['guest', 'admin'],
    // },
    handler: function(request, reply) {
        let meta = {
            context: 'subject',
            controller: 'Subjects',
            action: 'List Subject',
            title : 'List Subject',
            description: 'List Subject',
        };
        // console.log(request.auth);
        let page = request.query.page || 1;
        let config = request.server.configManager;
        let itemsPerPage =  config.get('web.paging.itemsPerPage');
        let numberVisiblePages = config.get('web.paging.numberVisiblePages');
       
        let options = {};
        if (request.query.keyword && request.query.keyword.length > 0) {
            let re = new RegExp(request.query.keyword, 'i');
            options.name = re;
        }
        options = {
            // user_id: request.auth.credentials.uid,
            status: 1,
        };
        Subject.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
            if (err) {
                request.log(['error', 'list'], err);
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items, meta:meta};
            reply.view('web-subject/view/list',dataRes);
        });


    }
}
exports.view = {
    // auth: {
    //     // strategy: 'jwt',
    //     // scope: ['guest', 'admin'],
    // },
    pre: [
        { method: getItem, assign: 'subject' },
    ],
    handler: function(request, reply) {
        let subject = request.pre.subject;
        // console.log('subject', subject)
        if (!subject) {
            return reply(Boom.notFound('subject is not be found'));
        }
        let meta = {}
        if(subject) {
            meta.controller = 'Subjects';
            meta.action = 'View Subject';
            meta.title  = 'View Subject';
            meta.description  = 'View Subject';
        
        }
        return reply.view('web-subject/view/view', { subject: subject, meta: meta });
    },
}
// exports.add = {
//     auth: {
//         strategy: 'jwt',
//         scope: ['user', 'admin'],
//     },
//     handler: function(request, reply) {

//         console.log(request.auth);
//         let meta = {
//             context: 'subject',
//             controller: 'Subjects',
//             action: 'Add Subject',
//             title : 'Add Subject',
//             description: 'Add Subject',
//         };
            
//         return reply.view('web-subject/view/add', {meta: meta});
//     }
// }
// exports.create = {
//     auth: {
//         strategy: 'jwt',
//         scope: ['teacher', 'admin'],
//     },
//     handler: (request, reply) => {
//         let subject = new Subject(request.payload);
//         console.log(subject)
//     }
// }
// exports.edit = {
//     auth: {
//         strategy: 'jwt',
//         scope: ['teacher', 'admin'],
//     },
//     pre: [
//         {method: getItem, assign: 'subject'}
//     ],
//     handler: function(request, reply) {
//         let subject = request.pre.subject;
//         if(!subject) {
//             return reply(Boom.notFound('subject is not be found'));
//         }
//         let meta = {
//             controller: 'Subjects',
//             action: 'Edit Subject',
//             title : 'Edit Subject',
//             description : 'Edit Subject'
//         };
//         return reply.view('web-subject/view/edit', {meta: meta});
//     }
// }

// exports.update = {
//     auth: {
//         strategy: 'jwt',
//         scope: ['teacher', 'admin'],
//     },
//     handler: (request, reply) => {
//         let subject = new Subject(request.payload);
//         console.log(subject)
//     }
// }
// exports.delete = {
//     auth: {
//         strategy: 'jwt',
//         scope: ['teacher', 'admin'],
//     },
//     pre: [
//         { method: getItem, assign: 'subject' }
//     ],
//     handler: function(request, reply) {
//         const subject = request.pre.subject;
//         subject.remove((err) => {
//             if (err) {
//                 reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
//             }
//             return reply(subject);
//         });
//     }
// }
/**
 * Middleware
 */
function getItem(request, reply) {
    const id = request.params._id;
    let options = {
        id: id,
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
