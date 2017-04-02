'use strict';

ApplicationConfiguration.registerModule('quiz');
angular.module('quiz').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Quizzes', 'quiz', 'dropdown', '/quiz(/create)?');
        Menus.addSubMenuItem('topbar', 'quiz', 'List Quizzes', 'quiz');
        Menus.addSubMenuItem('topbar', 'quiz', 'New Quiz', 'quiz/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listQuiz', {
            url: '/quiz',
            templateUrl: '/modules/admin-quiz/list-quiz.html'
        }).
        state('createQuiz', {
            url: '/quiz/create',
            templateUrl: '/modules/admin-quiz/create-quiz.html'
        }).
        state('viewQuiz', {
            url: '/quiz/:itemId',
            templateUrl: '/modules/admin-quiz/view-quiz.html'
        }).
        state('editQuiz', {
            url: '/quiz/:itemId/edit',
            templateUrl: '/modules/admin-quiz/edit-quiz.html'
        });
    }
]);
