exports.index = {
    auth: {
      strategy: 'jwt',
      mode: 'try',
      scope: ['guest','admin','user']
    },
    handler: function(request, reply) {
        if (!request.auth.credentials || !( request.auth.credentials.uid && request.auth.credentials.scope.includes('admin')) ) {
            return reply.redirect('/signin');
        }
        return reply.view('admin-dashboard/view/default', {}, {layout: 'admin/layout-admin'});
    },
}
