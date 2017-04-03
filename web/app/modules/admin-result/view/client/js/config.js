'use strict';

ApplicationConfiguration.registerModule('result');
angular.module('result').run(['Menus',
    function(Menus) {
        // Menus.addMenuItem('topbar', 'Results', 'result', 'dropdown', '/result(/create)?');
        // Menus.addSubMenuItem('topbar', 'result', 'List Results', 'result');
        // Menus.addSubMenuItem('topbar', 'result', 'New Result', 'result/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listResult', {
            url: '/result',
            templateUrl: '/modules/admin-result/list-result.html'
        }).
        state('createResult', {
            url: '/result/create',
            templateUrl: '/modules/admin-result/create-result.html'
        }).
        state('viewResult', {
            url: '/result/:itemId',
            templateUrl: '/modules/admin-result/view-result.html'
        }).
        state('editResult', {
            url: '/result/:itemId/edit',
            templateUrl: '/modules/admin-result/edit-result.html'
        });
    }
]);
