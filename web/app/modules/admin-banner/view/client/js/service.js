'use strict';

//Banners service used to communicate Banners REST endpoints
angular.module('banners').factory('Banners', ['$resource',
    function($resource) {
        return $resource('banner/:bannerId', {
            bannerId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                isArray: false,
            }
        });
    }
]);
