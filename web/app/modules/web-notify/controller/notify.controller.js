exports.home = {
    handler: function (request, reply) {
        let meta = {
            title: 'Notify',
            description: ''
        }
        return reply.view('web-notify/view/default',{meta: meta});
    },
}