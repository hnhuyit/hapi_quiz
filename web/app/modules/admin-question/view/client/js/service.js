'use strict';

angular.module('question').factory('Question', ['$resource',
    function($resource) {
        return $resource('question/:itemId', {
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
