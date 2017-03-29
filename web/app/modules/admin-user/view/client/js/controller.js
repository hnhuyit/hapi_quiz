'use strict';

// Users controller
angular.module('users').controller('UsersController', ['$scope', '$log', '$stateParams', '$location', 'Authentication', 'Users', 'Option',
    function($scope, $log, $stateParams, $location, Authentication, Users, Option) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        $scope.gotoList = function() {
            $location.path('users');
        }

        $scope.statuses = Option.getStatus();
        $scope.userRoles = Option.getRoles();

        // Create new user
        $scope.create = function() {
            var user = new Users({
                name: this.name,
                email: this.email,
                password: this.password,
                cfpassword: this.cfpassword,
                status: this.status,
                roles: this.roles
            });

            // Redirect after save
            user.$save(function(response) {
                if (response._id) {
                    $location.path('users/' + response._id);
                    $scope.name = '';
                } else {
                    $scope.error = response.message;
                }



            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing User
        $scope.remove = function(user) {
            if (user) {
                user.$remove();

                for (var i in $scope.users) {
                    if ($scope.users[i] === user) {
                        $scope.users.splice(i, 1);
                    }
                }
            } else {
                $scope.user.$remove(function() {
                    $scope.gotoList();
                });
            }
        };

        $scope.update = function() {
            var user = $scope.user;
            delete user.__v;
            delete user.password_token;
            delete user.created;
            delete user.provider;
            delete user.activeToken;

            $scope.$log = $log;
            user.password = $scope.password;
            user.cfpassword = $scope.cfpassword;
            user.$update(function(response) {
                if (response.error) {
                    $scope.error = response.message;
                } else {
                    $scope.gotoList();
                }


            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        $scope.findOne = function() {
            $scope.user = Users.get({
                userId: $stateParams.userId
            });

        };

        $scope.currentPage = 1;

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            getListData();
        };

        function getListData() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                role: $scope.search.role,
                status: $scope.search.status
            };

            Users.query(options, function(data) {

                $scope.users = data.items;
                $scope.totalItems = data.totalItems;
                $scope.itemsPerPage = data.itemsPerPage;
                $scope.numberVisiblePages = data.numberVisiblePages;
            });
        }

        // Find a list of Posts
        $scope.find = function() {
            getListData();
        };
        //search
        $scope.search = function() {
            getListData();
        };
        //reset
        $scope.reset = function() {
            $scope.search.keyword = "";
            $scope.search.role = "";
            $scope.search.status = "";
            $scope.currentPage = 1;
            getListData();
        };
    }
]);
