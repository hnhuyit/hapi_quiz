'use strict';

angular.module('quiz').factory('Quiz', ['$resource',
    function($resource) {
        return $resource('quiz/:itemId', {
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
