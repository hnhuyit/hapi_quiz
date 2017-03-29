const mongoose = require('mongoose');
const Page = mongoose.model('Page');


exports.about = {

    handler: function(request, reply) {
        let promise = Page.findOne({ 'slug': 'about' });
        promise.then(function(page) {
            let meta = {
                title: page.title,
                description: ''
            }
            return reply.view('web-page/view/about', { page: page, meta: meta });
        }).catch(function(err) {
            request.log(['error'], err);
            return reply.continue();
        });
    }
}

exports.faq = {
    handler: function(request, reply) {
        let promise = Page.findOne({ 'slug': 'faq' });
        promise.then(function(page) {
            let meta = {
                title: page.title,
                description: ''
            }
            return reply.view('web-page/view/default', { page: page, meta: meta });
        }).catch(function(err) {
            request.log(['error'], err);
            return reply.continue();
        });
    }
}

exports.term = {
    handler: function(request, reply) {
        let promise = Page.findOne({ 'slug': 'terms' });
        promise.then(function(page) {
            let meta = {
                title: page.title,
                description: ''
            }
            return reply.view('web-page/view/default', { page: page, meta: meta });
        }).catch(function(err) {
            request.log(['error'], err);
            return reply.continue();
        });
    }
}

exports.help = {
    handler: function(request, reply) {
        let promise = Page.findOne({ 'slug': 'help' });
        promise.then(function(page) {
            let meta = {
                title: page.title,
                description: ''
            }
            return reply.view('web-page/view/default', { page: page, meta: meta });
        }).catch(function(err) {
            request.log(['error'], err);
            return reply.continue();
        });
    }
}
exports.support = {
    handler: function(request, reply) {
        let promise = Page.findOne({ 'slug': 'support' });
        promise.then(function(page) {
            let meta = {
                title: page.title,
                description: ''
            }
            return reply.view('web-page/view/default', { page: page, meta: meta });
        }).catch(function(err) {
            request.log(['error'], err);
            return reply.continue();
        });
    }
}

exports.error404 = {
    handler: function(request, reply) {
        let promise = Page.findOne({ 'slug': 'error404' });
        promise.then(function(page) {
            let meta = {
                title: page.title,
                description: ''
            }
            return reply.view('web-page/view/404', { page: page, meta: meta }).code(404);
        }).catch(function(err) {
            request.log(['error'], err);
            return reply.continue();
        });
    }
}

