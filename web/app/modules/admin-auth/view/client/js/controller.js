'use strict';

angular.module('auth').controller('AuthenticationController', ['$scope', '$http', '$location', '$window', 'Authentication',
	function ($scope, $http, $location, $window, Authentication) {
		$scope.authentication = Authentication;

		$scope.signin = function () {
			var data = $scope.credentials;
			data.scope = 'admin';
			$http.post($window.settings.services.userApi + '/api/user/login', data).success(function (response) {
				console.log(response);
				if (response.token) {
					$window.location.href = '/';
				}
				$scope.error = response.message;
			}).error(function (response) {
				$scope.error = response.message;
				console.log($scope.error);
			});
		};

		$scope.signout = function () {
			$http.get($window.settings.services.userApi + '/api/user/logout').success(function (response) {
				$scope.authentication.user = '';
				$window.location.href = '/';
			}).error(function (response) {
				$scope.error = response.message;
			});
		};
	}
]);