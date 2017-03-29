exports.contact = {
    handler: function(request, reply) {
        let meta = {
            title: 'Contact us',
            description: ''
        }
        return reply.view('web-contact/view/default',{meta: meta});
    },
}
