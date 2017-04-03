'use strict';

ApplicationConfiguration.registerModule('anwser');
angular.module('anwser').run(['Menus',
    function(Menus) {
        // Menus.addMenuItem('topbar', 'Anwsers', 'anwser', 'dropdown', '/anwser(/create)?');
        // Menus.addSubMenuItem('topbar', 'anwser', 'List Anwsers', 'anwser');
        // Menus.addSubMenuItem('topbar', 'anwser', 'New Anwser', 'anwser/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listAnwser', {
            url: '/anwser',
            templateUrl: '/modules/admin-anwser/list-anwser.html'
        }).
        state('createAnwser', {
            url: '/anwser/create',
            templateUrl: '/modules/admin-anwser/create-anwser.html'
        }).
        state('viewAnwser', {
            url: '/anwser/:itemId',
            templateUrl: '/modules/admin-anwser/view-anwser.html'
        }).
        state('editAnwser', {
            url: '/anwser/:itemId/edit',
            templateUrl: '/modules/admin-anwser/edit-anwser.html'
        });
    }
]);
