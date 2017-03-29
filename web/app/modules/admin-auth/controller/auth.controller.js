'use strict';


exports.viewLogin = {
    auth: false,
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/');
        }
        return reply.view('admin-auth/view/signin', null, { layout: 'admin/layout-admin-login' });
    },
}
