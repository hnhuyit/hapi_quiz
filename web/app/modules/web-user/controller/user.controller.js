exports.login = {
    handler: function(request, reply) {
        let meta = {
            title: 'Login',
            description: ''
        }
        return reply.view('web-user/view/login', { meta: meta });
    },
}
exports.register = {
    handler: function(request, reply) {
        let meta = {
            title: 'Register',
            description: ''
        }
        return reply.view('web-user/view/register', { meta: meta });
    },
}
exports.account = {
    auth: {
        strategy: 'jwt',
        scope: ['user','admin']
    },
    handler: function(request, reply) {
        let meta = {
            title: 'My account',
            description: ''
        }
        return reply.view('web-user/view/account', { meta: meta });
    },
}
exports.forgot = {
    handler: function(request, reply) {
        let meta = {
            title: 'Forgot Password',
            description: ''
        }
        return reply.view('web-user/view/forgot', { meta: meta });
    },
}
exports.reset = {
    handler: function(request, reply) {
        let token = request.query.token;
        let meta = {
            title: 'Reset password',
            description: ''
        }
        return reply.view('web-user/view/reset', { token: token, meta: meta});
    },
}
exports.changepassword = {

    handler: function(request, reply) {
        let meta = {
            title: 'Change password',
            description: ''
        }
        return reply.view('web-user/view/changepassword', { meta: meta });
    },
}
