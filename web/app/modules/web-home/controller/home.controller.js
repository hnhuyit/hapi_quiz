"use strict";

exports.home = {
    handler: function (request, reply) {
        // request.log('info','ddd');
        let meta = {
            title: 'Home',
            description: ''
        }
        return reply.view('web-home/view/default',{meta: meta});
    },
}