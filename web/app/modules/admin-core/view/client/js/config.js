'use strict';
ApplicationConfiguration.registerModule('core');
// Setting up route
angular.module('core').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Manage Content', 'contents', 'dropdown', '');
        Menus.addSubMenuItem('topbar', 'contents', 'List Pages', 'pages');
        Menus.addSubMenuItem('topbar', 'contents', 'List Banners', 'banners');
        Menus.addSubMenuItem('topbar', 'contents', 'List Categories', 'categories');
        Menus.addSubMenuItem('topbar', 'contents', 'List Posts', 'posts');

        Menus.addMenuItem('topbar', 'Manage User', 'users', 'dropdown', '');
        Menus.addSubMenuItem('topbar', 'users', 'List Users', 'users');
        Menus.addSubMenuItem('topbar', 'users', 'List Contacts', 'contacts');
    }
])
.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
        state('home', {
            url: '/',
            templateUrl: '/modules/admin-core/home.html'
        });
    }
]);
