'use strict';

angular.module('qquestion').controller('QquestionsController', ['$scope', '$stateParams', '$location','$window','Option', 'Authentication','FileUploader', 'Qquestion',
    function($scope, $stateParams, $location, $window,Option, Authentication, FileUploader, Qquestion) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        
        $scope.uploadApi = $window.settings.services.uploadApi;
        $scope.webUrl = $window.settings.services.webUrl;

        $scope.qquestion = new Qquestion({});
        
        $scope.statuses = Option.getStatus();
        $scope.qquestion.status = 1;
        

        
         

        $scope.gotoList = function() {
            $location.path('qquestion');
        }
        //CRUD 
        $scope.create = function() {
            var qquestion = $scope.qquestion;
            qquestion.$save(function(response) {
                $location.path('qquestion/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(qquestion) {
            if (qquestion) {
                qquestion.$remove();
                for (var i in $scope.items) {
                    if ($scope.items[i] === qquestion) {
                        $scope.items.splice(i, 1);
                    }
                }
            } else {
                $scope.qquestion.$remove(function() {
                    $scope.gotoList();
                });
            }
        };

        $scope.update = function() {
            var qquestion = $scope.qquestion;
            qquestion.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.findOne = function() {
            $scope.qquestion = Qquestion.get({
                itemId: $stateParams.itemId
            });
        };

        $scope.find = function() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };
            Qquestion.query(options, function(data) {
                $scope.items = data.items;
                $scope.totalItems = data.totalItems;
                $scope.itemsPerPage = data.itemsPerPage;
                $scope.numberVisiblePages = data.numberVisiblePages;
            });
        };
        //SEARCH AND PAGINATION
        $scope.currentPage = 1;

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.search = function() {
            $scope.find();
        };
        $scope.reset = function() {
            $scope.search.keyword = "";
            $scope.currentPage = 1;
            $scope.find();
        };
    }
]);
