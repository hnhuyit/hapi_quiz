'use strict';

ApplicationConfiguration.registerModule('contacts');
angular.module('contacts').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Contacts', 'contacts', 'dropdown', '/contacts(/create)?');
        Menus.addSubMenuItem('topbar', 'contacts', 'List Contacts', 'contacts');
        Menus.addSubMenuItem('topbar', 'contacts', 'New Contact', 'contacts/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        // Contacts state routing
        $stateProvider.
        state('listContacts', {
            url: '/contacts',
            templateUrl: '/modules/admin-contact/list-contacts.html'
        }).
        state('createContact', {
            url: '/contacts/create',
            templateUrl: '/modules/admin-contact/create-contact.html'
        }).
        state('viewContact', {
            url: '/contacts/:contactId',
            templateUrl: '/modules/admin-contact/view-contact.html'
        }).
        state('editContact', {
            url: '/contacts/:contactId/edit',
            templateUrl: '/modules/admin-contact/edit-contact.html'
        });
    }
]);
