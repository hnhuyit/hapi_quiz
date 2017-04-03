'use strict';

ApplicationConfiguration.registerModule('subject');
angular.module('subject').run(['Menus',
    function(Menus) {
        // Menus.addMenuItem('topbar', 'Subjects', 'subject', 'dropdown', '/subject(/create)?');
        // Menus.addSubMenuItem('topbar', 'subject', 'List Subjects', 'subject');
        // Menus.addSubMenuItem('topbar', 'subject', 'New Subject', 'subject/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listSubject', {
            url: '/subject',
            templateUrl: '/modules/admin-subject/list-subject.html'
        }).
        state('createSubject', {
            url: '/subject/create',
            templateUrl: '/modules/admin-subject/create-subject.html'
        }).
        state('viewSubject', {
            url: '/subject/:itemId',
            templateUrl: '/modules/admin-subject/view-subject.html'
        }).
        state('editSubject', {
            url: '/subject/:itemId/edit',
            templateUrl: '/modules/admin-subject/edit-subject.html'
        });
    }
]);
