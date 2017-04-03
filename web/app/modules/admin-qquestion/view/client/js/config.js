'use strict';

ApplicationConfiguration.registerModule('qquestion');
angular.module('qquestion').run(['Menus',
    function(Menus) {
        // Menus.addMenuItem('topbar', 'Qquestions', 'qquestion', 'dropdown', '/qquestion(/create)?');
        // Menus.addSubMenuItem('topbar', 'qquestion', 'List Qquestions', 'qquestion');
        // Menus.addSubMenuItem('topbar', 'qquestion', 'New Qquestion', 'qquestion/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listQquestion', {
            url: '/qquestion',
            templateUrl: '/modules/admin-qquestion/list-qquestion.html'
        }).
        state('createQquestion', {
            url: '/qquestion/create',
            templateUrl: '/modules/admin-qquestion/create-qquestion.html'
        }).
        state('viewQquestion', {
            url: '/qquestion/:itemId',
            templateUrl: '/modules/admin-qquestion/view-qquestion.html'
        }).
        state('editQquestion', {
            url: '/qquestion/:itemId/edit',
            templateUrl: '/modules/admin-qquestion/edit-qquestion.html'
        });
    }
]);
