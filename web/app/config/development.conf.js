'use strict';

let config = {};

config.web = {
    facebook: {
        clientID: process.env.FACEBOOK_ID || '427079307489462',
        clientSecret: process.env.FACEBOOK_SECRET || 'd78875d70774594c0b93d646c07cb6ab',
        callbackURL: '/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'yXwFK6ff3fOc8dvessqKvd9Z8',
        clientSecret: process.env.TWITTER_SECRET || 'k0w9heOObYwlwchdRBQ6tmHiPQN5O26nwz5XDzxPWPtby6llNx',
        callbackURL: '/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || '941481178075-mrmusgvq3asuq1relija3smn7psmogkh.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'sSIpuxYkac8r8LgXtVJ9pM6W',
        callbackURL: '/auth/google/callback'
    },
    assets: {
        js: [
            'public/assets/lib/jquery/dist/jquery.min.js',
            'public/assets/lib/bootstrap/dist/js/bootstrap.min.js',
            'public/assets/lib/angular/angular.min.js',
            'public/assets/lib/angular-cookies/angular-cookies.min.js',
            'public/assets/lib/socket.io-client/socket.io.js',
            'app/modules/web-*/view/client/js/*.js',
            'public/assets/js/app.js',
        ],
        css: [
            'public/assets/lib/bootstrap/dist/css/bootstrap.min.css',
            'public/assets/css/styles.css',
        ]
    },
    adminassets: {
        css: [
            'public/assets/lib/AdminLTE/bootstrap/css/bootstrap.min.css',
            'public/assets/lib/components-font-awesome/css/font-awesome.min.css',
            'public/assets/lib/Ionicons/css/ionicons.min.css',
            'public/assets/lib/AdminLTE/plugins/datatables/dataTables.bootstrap.css',
            'public/assets/lib/AdminLTE/dist/css/skins/skin-blue.min.css',
            'public/assets/lib/AdminLTE/plugins/select2/select2.min.css',
            'public/assets/lib/AdminLTE/dist/css/AdminLTE.min.css',
            'app/modules/admin-*/view/client/style/*.css',
        ],
        js: [
            'public/assets/lib/ckeditor/ckeditor.js',
            'public/assets/lib/jquery/dist/jquery.min.js',
            'public/assets/lib/bootstrap/dist/js/bootstrap.min.js',
            'public/assets/lib/AdminLTE/dist/js/app.min.js',
            'public/assets/lib/angular/angular.js',
            'public/assets/lib/angular-resource/angular-resource.js',
            'public/assets/lib/angular-animate/angular-animate.js',
            'public/assets/lib/angular-ui-router/release/angular-ui-router.js',
            'public/assets/lib/angular-ui-utils/index.js',
            'public/assets/lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'public/assets/lib/angular-file-upload/dist/angular-file-upload.min.js',
            'public/assets/lib/angular-sanitize/angular-sanitize.min.js',
            'public/assets/lib/ui-select/dist/select.js',
            'public/assets/lib/AdminLTE/plugins/select2/select2.min.js',
            'public/assets/lib/angular-messages/angular-messages.min.js',
            'public/assets/lib/angular-input-masks/angular-input-masks-standalone.min.js',
            'public/assets/lib/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js',
            'app/modules/admin-core/view/client/js/app.js',
            'app/modules/admin-core/view/client/js/config.js',
            'app/modules/admin-core/view/client/js/service.js',
            'app/modules/admin-*/view/client/js/*.js',
        ]
    },
};

module.exports = config;