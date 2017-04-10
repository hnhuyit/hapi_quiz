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

        // console.log('Register:', data);
        AuthService.register(data).then(function (res) {
          $scope.registerSuccess = true;
          $scope.errors = null;
          toastr.success('Register Information', 'Registration successful, please login.!');
          setTimeout(function(){
            window.location.href = '/login';
          }, 2000);
        }).catch(function (res) {
          // console.log(res);
          $scope.errors = res.data.message;
        });
      }
    };
    $scope.login = function () {
      // if ($scope.loginForm.$valid) {
        var data = $scope.user;
        data.scope = 'teacher';
        AuthService.login(data).success(function (res) {
          toastr.success( 'Login success', 'Login Information');
          setTimeout(function(){
            if (res.token) {
              $window.location.href = '/';
            }
          }, 1000);
        }).error(function (res) {
          // console.log('res', res);
          // $scope.errors = res.message; 
          toastr.error(res.message, 'Login Information');
        });
      // }
    };
    $scope.logout = function () {
      AuthService.logout().success(function (res) {
        $cookies.put('token', '');
        window.location.href = '/';
      }).error(function (res) {
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
    $scope.profile = function() {
      AuthService.profile().then(function(res) {
        $scope.user = res.data;
        console.log(res);
      }).catch(function(res) {
        $scope.errors = res.data.message;
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