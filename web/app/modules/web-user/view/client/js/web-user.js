angular.module('Auth', []).service('AuthService', [
  '$http',
  '$window',
  function ($http, $window) {
    return {
      register: function (data) {
        return $http.post($window.settings.services.userApi + '/api/user/register', data);
      },
      login: function (data) {
        return $http.post($window.settings.services.userApi + '/api/user/login', data);
      },
      forgot: function (data) {
        return $http.post($window.settings.services.userApi + '/api/user/forgot', data);
      },
      account: function () {
        return $http.get($window.settings.services.userApi + '/api/user/account');
      },
      logout: function () {
        return $http.get($window.settings.services.userApi + '/api/user/logout');
      },
      updateAccount: function (data) {
        return $http.post($window.settings.services.userApi + '/api/user/updateprofile', data);
      },
      profile: function () {
        return $http.get($window.settings.services.userApi + '/api/user/profile');
      },
      changepassword: function (data) {
        return $http.post($window.settings.services.userApi + '/api/user/changepassword', data);
      },
      reset: function (token, data) {
        return $http.post($window.settings.services.userApi + '/api/user/reset?token=' + token, data);
      }
    };
  }
]).controller('AuthController', [
  '$scope',
  '$filter',
  'AuthService',
  '$cookies',
  function ($scope, $filter, AuthService, $cookies) {
    $scope.register = function () {
      if ($scope.registerForm.$valid) {
        var data = {
          name: this.name,
          email: this.email,
          password: this.password,
          cfpassword: this.cfpassword
        };
        AuthService.register(data).then(function (res) {
          $scope.registerSuccess = true;
          window.location.href = '/login';
        }).catch(function (res) {
          $scope.errors = [res.data.message];
        });
      }
    };
    $scope.login = function () {
      if ($scope.loginForm.$valid) {
        var data = {
          email: this.email,
          password: this.password
        };
        AuthService.login(data).then(function (res) {
          $scope.loginSuccess = true;
          console.log(res.data.token);
          $cookies.put('token', res.data.token);
          window.location.href = '/';
        }).catch(function (res) {
          $scope.errors = [res.data.message];
        });
      }
    };
    $scope.logout = function () {
      AuthService.logout().then(function (res) {
        $cookies.put('token', '');
        window.location.href = '/';
      }).catch(function (res) {
        $scope.errors = [res.data.message];
      });
    };
    $scope.myaccount = function () {
      AuthService.account().then(function (res) {
        $scope.user = res.data;
      }).catch(function (res) {
        $scope.errors = [res.data.message];
      });
    };
    $scope.updateMyAccount = function () {
      var data = {
        email: this.user.email,
        name: this.user.name
      };
      AuthService.updateAccount(data).then(function (res) {
        $scope.updateSuccess = true;
      }).catch(function (res) {
        $scope.errors = [res.data.message];
      });
    };
    $scope.changePassword = function () {
      var data = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmNewPassword: this.confirmNewPassword
      };
      AuthService.changepassword(data).then(function (res) {
        $scope.updateSuccess = true;
      }).catch(function (res) {
        $scope.errors = [res.data.message];
      });
    };
    $scope.reset = function () {
      var data = {
        newPassword: this.newPassword,
        confirmNewPassword: this.confirmNewPassword
      };
      var resetPasswordToken = angular.element('#resetPasswordToken').val();
      console.log(resetPasswordToken);
      AuthService.reset(resetPasswordToken, data).then(function (res) {
        $scope.updateSuccess = true;
      }).catch(function (res) {
        $scope.errors = [res.data.message];
      });
    };
    $scope.forgot = function () {
      var data = { email: this.email };
      AuthService.forgot(data).then(function (res) {
        $scope.updateSuccess = true;
      }).catch(function (res) {
        $scope.errors = [res.data.message];
      });
    };
  }
]);