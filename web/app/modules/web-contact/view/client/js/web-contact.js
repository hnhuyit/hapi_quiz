angular.module('Contact', [])
    .service("ContactService", ['$http', '$window', function ($http, $window) {
        return {
            submit: function (data) {
                console.log($window.settings.services.contactApi);
                return $http.post($window.settings.services.contactApi + '/api/contact', data);
            }
        };
    }])
    .controller("ContactController", ['$scope', '$filter', 'ContactService', function ($scope, $filter, ContactService) {
        $scope.submit = function () {
            if ($scope.contactForm.$valid) {
                var data = { name: this.name, email: this.email, message: this.message }
                ContactService.submit(data).success(function (data, status, headers) {
                    console.log(data);
                    if (data.status == 1) {
                        $scope.contactSuccess = true;
                    } else {
                        $scope.errors = data.messages;
                    }
                });
            }
        }

    }]);
