'use strict';

ApplicationConfiguration.registerModule('question');
angular.module('question').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Questions', 'question', 'dropdown', '/question(/create)?');
        Menus.addSubMenuItem('topbar', 'question', 'List Questions', 'question');
        Menus.addSubMenuItem('topbar', 'question', 'New Question', 'question/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listQuestion', {
            url: '/question',
            templateUrl: '/modules/admin-question/list-question.html'
        }).
        state('createQuestion', {
            url: '/question/create',
            templateUrl: '/modules/admin-question/create-question.html'
        }).
        state('viewQuestion', {
            url: '/question/:itemId',
            templateUrl: '/modules/admin-question/view-question.html'
        }).
        state('editQuestion', {
            url: '/question/:itemId/edit',
            templateUrl: '/modules/admin-question/edit-question.html'
        });
    }
]);
