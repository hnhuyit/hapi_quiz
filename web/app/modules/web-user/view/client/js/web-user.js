"use strict";

angular.module('Auth', ['toastr']).config(function(toastrConfig) {
    angular.extend(toastrConfig, {
      autoDismiss: false,
      containerId: 'toast-container',
      maxOpened: 0,    
      newestOnTop: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
      preventOpenDuplicates: false,
      timeOut: 2000,
      target: 'body'
    });
  })
  .service('AuthService', ['$http','$window', function ($http, $window) {
    return {
      register: function (data) {
        return $http.post($window.settings.services.userApi + '/api/user/register', data);
      },
      loginTeacher: function (data) {
        return $http.post($window.settings.services.userApi + '/api/user/loginTeacher', data);
      },
      forgot: function (data) {
        return $http.post($window.settings.services.userApi + '/api/user/forgot', data);
      },
      account: function () {
        return $http.get($window.settings.services.userApi + '/api/user/account');
      },
      logoutTeacher: function () {
        return $http.get($window.settings.services.userApi + '/api/user/logoutTeacher');
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
  '$window',
  '$filter',
  'toastr',
  'AuthService',
  '$cookies',
  function ($scope, $window, $filter, toastr, AuthService, $cookies) {
    //Register teacher
    $scope.register = function () {
      if ($scope.registerForm.$valid) {
        var data = {
          name: this.name,
          email: this.email,
          rules: ['teacher'],
          password: this.password,
          cfpassword: this.cfpassword
        };

        console.log('Login:', data);
        AuthService.register(data).then(function (res) {
          $scope.registerSuccess = true;
          $scope.errors = null;
          toastr.success('Register Information', 'Registration successful, please login.!');
          setTimeout(function(){
            window.location.href = '/login';
          }, 2000);
        }).catch(function (res) {
          // console.log(res);
          $scope.errors = [res.data.message];
        });
      }
    };
    $scope.loginTeacher = function () {
      // if ($scope.loginForm.$valid) {
        var data = $scope.user;
        data.scope = 'teacher';

        // console.log(data);
        AuthService.loginTeacher(data).success(function (res) {
          // $scope.loginSuccess = true;
          // console.log(res.data.token);
          // $cookies.put('token', res.data.token);
          // window.location.href = '/';
          console.log(res);
          if (res.tokenUser) {
            $window.location.href = '/';
          }
          $scope.error = response.message;

        }).error(function (res) {
          $scope.errors = [res.data.message];
        });
      // }
    };
    $scope.logoutTeacher = function () {
      AuthService.logoutTeacher().then(function (res) {
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