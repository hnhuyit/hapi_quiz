'use strict';

ApplicationConfiguration.registerModule('pages');
angular.module('pages').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Pages', 'pages', 'dropdown', '/pages(/create)?');
        Menus.addSubMenuItem('topbar', 'pages', 'List Pages', 'pages');
        Menus.addSubMenuItem('topbar', 'pages', 'New Page', 'pages/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        // Pages state routing
        $stateProvider.
        state('listPages', {
            url: '/pages',
            templateUrl: '/modules/admin-page/list-pages.html'
        }).
        state('createPage', {
            url: '/pages/create',
            templateUrl: '/modules/admin-page/create-page.html'
        }).
        state('viewPage', {
            url: '/pages/:pageId',
            templateUrl: '/modules/admin-page/view-page.html'
        }).
        state('editPage', {
            url: '/pages/:pageId/edit',
            templateUrl: '/modules/admin-page/edit-page.html'
        });
    }
]);
