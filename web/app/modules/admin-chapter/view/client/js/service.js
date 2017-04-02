'use strict';

angular.module('chapter').factory('Chapter', ['$resource',
    function($resource) {
        return $resource('chapter/:itemId', {
            itemId: '@_id'
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
