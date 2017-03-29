'use strict';

// Posts controller
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', '$window', 'Option', 'Authentication', 'FileUploader', 'Posts', 'Categories',
    function($scope, $stateParams, $location, $window, Option, Authentication, FileUploader, Posts, Categories) {

        if (!Authentication.user.name) {
            $location.path('signin');
        }
        $scope.uploadApi = $window.settings.services.uploadApi;
        $scope.webUrl = $window.settings.services.webUrl;

        $scope.statuses = Option.getStatus();

        $scope.features = Option.getFeatures();

        $scope.authentication = Authentication;


        ///thumb upload

        $scope.isUploadImage0 = false;

        $scope.isInvalidFile0 = false;

        $scope.postPath = '/files/post/';


        var uploader0 = $scope.uploader0 = new FileUploader({
            url: $scope.uploadApi + '/api/upload/image',
            formData: [{ type: 'post' }],
            autoUpload: true
        });

        // FILTERS
        uploader0.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader0.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader0.onBeforeUploadItem = function(item) {
            $scope.$apply(function() {
                $scope.isUploadImage0 = true;
            });
        };
        uploader0.onSuccessItem = function(fileItem, response, status, headers) {
            $scope.review_thumb = $scope.webUrl + $scope.postPath + response.file.filename;
            if ($scope.post) {
                $scope.post.thumb = $scope.postPath + response.file.filename;
            } else {
                $scope.thumb = $scope.postPath + response.file.filename;
            }
        };

        uploader0.onCompleteItem = function(fileItem, response, status, headers) {
            $scope.$apply(function() {
                $scope.isUploadImage0 = false;
            });
        };
        //////

        $scope.isUploadImage = false;

        $scope.isInvalidFile = false;

        var uploader = $scope.uploader = new FileUploader({
            url: $scope.uploadApi + '/api/upload/image',
            formData: [{ type: 'post' }],
            autoUpload: true
        });

        // FILTERS
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onBeforeUploadItem = function(item) {
            $scope.$apply(function() {
                $scope.isUploadImage = true;
            });
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            $scope.review_image = $scope.webUrl + $scope.postPath + response.file.filename;
            if ($scope.post) {
                $scope.post.image = $scope.postPath + response.file.filename;
            } else {
                $scope.image = $scope.postPath + response.file.filename;
            }
        };

        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            $scope.$apply(function() {
                $scope.isUploadImage = false;
            });
        };

        $scope.gotoList = function() {
            $location.path('posts');
        }

        $scope.categories = Categories.query({type:'post'});

        // Create new Post
        $scope.create = function() {
            // Create new Post object
            var post = new Posts({
                title: this.title,
                slug: this.slug,
                feature: this.feature,
                teaser: this.teaser,
                image: this.image,
                thumb: this.thumb,
                content: this.content,
                status: this.status,
                category: this.category,
                attrs: this.attrs
            });

            // Redirect after save
            post.$save(function(response) {
                $scope.message = 'post success';
                $location.path('posts/' + response._id);

                // Clear form fields
                $scope.title = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Post
        $scope.remove = function(post) {
            if (post) {
                post.$remove();

                for (var i in $scope.posts) {
                    if ($scope.posts[i] === post) {
                        $scope.posts.splice(i, 1);
                    }
                }
            } else {
                $scope.post.$remove(function() {
                    //$location.path('posts');
                    $scope.gotoList();
                });
            }
        };

        // Update existing Post
        $scope.update = function() {
            var post = $scope.post;
            delete post.created;
            delete post.__v;
            post.$update(function() {
                //$location.path('posts/' + post._id);
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Post
        $scope.findOne = function() {
            $scope.post = Posts.get({
                postId: $stateParams.postId
            }, function() {
                if ($scope.post.thumb) {
                    $scope.review_thumb = $scope.webUrl + $scope.post.thumb;
                }
                if ($scope.post.image) {
                    $scope.review_image = $scope.webUrl + $scope.post.image;
                }
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
                category: $scope.search.category,
                status: $scope.search.status,
                feature: $scope.search.feature
            };

            Posts.query(options, function(data) {
                $scope.items = data.items;
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
            $scope.search.category = "";
            $scope.search.status = "";
            $scope.search.feature = "";
            $scope.currentPage = 1;
            getListData();
        };


    }
]);
