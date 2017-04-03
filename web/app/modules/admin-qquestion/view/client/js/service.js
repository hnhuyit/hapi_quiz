'use strict';

angular.module('qquestion').factory('Qquestion', ['$resource',
    function($resource) {
        return $resource('qquestion/:itemId', {
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
