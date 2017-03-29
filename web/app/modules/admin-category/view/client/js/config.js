'use strict';

ApplicationConfiguration.registerModule('categories');

angular.module('categories').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Categories', 'categories', 'dropdown', '/categories(/create)?');
        Menus.addSubMenuItem('topbar', 'categories', 'List Categories', 'categories');
        Menus.addSubMenuItem('topbar', 'categories', 'New Category', 'categories/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        // Categories state routing
        $stateProvider.
        state('listCategories', {
            url: '/categories',
            templateUrl: '/modules/admin-category/list-categories.html'
        }).
        state('createCategory', {
            url: '/categories/create',
            templateUrl: '/modules/admin-category/create-category.html'
        }).
        state('viewCategory', {
            url: '/categories/:categoryId',
            templateUrl: '/modules/admin-category/view-category.html'
        }).
        state('editCategory', {
            url: '/categories/:categoryId/edit',
            templateUrl: '/modules/admin-category/edit-category.html'
        });
    }
]);
