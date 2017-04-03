'use strict';
ApplicationConfiguration.registerModule('core');
// Setting up route
angular.module('core').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Manage Content', 'contents', 'dropdown', '');
        Menus.addSubMenuItem('topbar', 'contents', 'Manage Pages', 'pages');
        Menus.addSubMenuItem('topbar', 'contents', 'Manage Banners', 'banners');
        Menus.addSubMenuItem('topbar', 'contents', 'Manage Categories', 'categories');
        Menus.addSubMenuItem('topbar', 'contents', 'Manage Posts', 'posts');

        Menus.addMenuItem('topbar', 'Manage User', 'users', 'dropdown', '');
        Menus.addSubMenuItem('topbar', 'users', 'Manage Users', 'users');
        Menus.addSubMenuItem('topbar', 'users', 'Manage Groups', 'group');
        Menus.addSubMenuItem('topbar', 'users', 'Manage Contacts', 'contacts');
    
        Menus.addMenuItem('topbar', 'Manage Subject', 'subjects', 'dropdown', '');
        Menus.addSubMenuItem('topbar', 'subjects', 'Manage Subjects', 'subject');
        Menus.addSubMenuItem('topbar', 'subjects', 'Manage Chapters', 'chapter');

        Menus.addMenuItem('topbar', 'Manage Quiz', 'quizzes', 'dropdown', '');
        Menus.addSubMenuItem('topbar', 'quizzes', 'Manage Quizzes', 'quiz');
        Menus.addSubMenuItem('topbar', 'quizzes', 'Manage Questions', 'question');
        Menus.addSubMenuItem('topbar', 'quizzes', 'Manage Exam', 'qquestion');

        Menus.addMenuItem('topbar', 'Manage Test Results', 'tests', 'dropdown', '');
        Menus.addSubMenuItem('topbar', 'tests', 'Manage Answers', 'anwser');
        Menus.addSubMenuItem('topbar', 'tests', 'Manage Results', 'result');

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
