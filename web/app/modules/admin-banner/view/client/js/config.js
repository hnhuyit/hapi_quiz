'use strict';

ApplicationConfiguration.registerModule('banners');

angular.module('banners').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Banners', 'banners', 'dropdown', '/banners(/create)?');
        Menus.addSubMenuItem('topbar', 'banners', 'List Banners', 'banners');
        Menus.addSubMenuItem('topbar', 'banners', 'New Banner', 'banners/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        // Banners state routing
        $stateProvider.
        state('listBanners', {
            url: '/banners',
            templateUrl: '/modules/admin-banner/list-banners.html'
        }).
        state('createBanner', {
            url: '/banners/create',
            templateUrl: '/modules/admin-banner/create-banner.html'
        }).
        state('viewBanner', {
            url: '/banners/:bannerId',
            templateUrl: '/modules/admin-banner/view-banner.html'
        }).
        state('editBanner', {
            url: '/banners/:bannerId/edit',
            templateUrl: '/modules/admin-banner/edit-banner.html'
        });
    }
]);
