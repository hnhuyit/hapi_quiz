'use strict';

angular.module('auth').controller('AuthenticationController', ['$scope', '$http', '$location', '$window', 'Authentication', 'toastr',
	function ($scope, $http, $location, $window, Authentication, toastr) {
		$scope.authentication = Authentication;
		$scope.signin = function () {
			var data = $scope.credentials;
			data.scope = 'admin';
			$http.post($window.settings.services.userApi + '/api/user/login', data).success(function (response) {
				toastr.success( 'Login success', 'Login Information');
				setTimeout(function(){
					if (response.token) {
						$window.location.href = '/';
					}
				}, 2000);
			}).error(function (response) {
				$scope.error = response.message;
				toastr.error(response.message, 'Login Information');
				// console.log($scope.error);
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

        $scope.viewProfile = function(id) {
            window.location.href = '#!/users/' + id + '/profile';
        };
	}
]);