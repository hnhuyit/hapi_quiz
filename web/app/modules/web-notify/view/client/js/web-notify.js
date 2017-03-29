angular.module('Common', [])
    .service("Socket", ['$http', '$cookies', '$window', function ($http, $cookies, $window) {
        var jwt = $cookies.get('token');

        console.log('Token: ' + jwt);
        if (!jwt || !jwt.length) {
            console.log('There is no token');
        }

        var socket = io($window.settings.services.socketApi);
        socket.on('connect', function () {
            socket.emit('authenticate', { token: jwt }); //send the jwt
            socket.on('authenticated', function () {
                // use the socket as usual
                console.log('User is authenticated');
            });
            socket.on('unauthorized', function (msg) {
                console.log("unauthorized: " + JSON.stringify(msg.data));
                throw new Error(msg.data.type);
            });
        });
        return socket;
    }])
    .service("PubSub", ['Socket', function (Socket) {
        var container = [];
        return {
            getChannel: function (options) {

                var collectionName = options.collectionName;
                var action = options.action;
                var modelId = options.modelId;
                var method = options.method;

                var names = [];

                names.push(collectionName, action, modelId, method);
                names = names.filter(function (item) { //remove empty element
                    return item ? true : false;
                });
                var channel = names.join('/');
                return channel;
            },
            subscribe: function (options, callback) {
                if (options) {
                    var channel = this.getChannel(options);
                    console.log("subscribe: " + channel);
                    Socket.on(channel, callback);
                    container.push(channel);
                } else {
                    throw 'Options must be an object';
                }
            },
            publish: function (options, data, callback) {
                if (options) {
                    var channel = this.getChannel(options);
                    console.log("publish: " + channel);
                    Socket.emit(channel, data, callback);
                } else {
                    throw 'Options must be an object';
                }
            },
            unSubscribe: function (options) {
                var channel = this.getChannel(options);
                var index = container.indexOf(channel);
                container.splice(index, 1);

            },
            unSubscribeAll: function () {
                for (var index = 0; index < container.length; index++) {
                    Socket.removeAllListeners(container[index]);
                }
                container = [];
            }

        }
    }]);


angular.module('Notify', ['Common'])
    .service("NotifyService", ['PubSub', function (PubSub) {

        return {


        }

    }])
    .controller("NotifyController", ['$scope', '$filter', 'NotifyService', 'PubSub', function ($scope, $filter, NotifyService, PubSub) {
        $scope.messages = [];

        var findIndexOfMessage = function (message) {
            return $scope.messages.findIndex(function (element, index, array) {
                //console.log('message id :'+ message._id);
                if (element._id == message._id) {
                    return true;
                }
                return false;
            });
        }
        var onMessages = function (data) {
            console.log(data);
            $scope.messages = data;
            $scope.$apply();
        };
        var onMessageCreated = function (message) {
            $scope.messages.push(message);
            $scope.action = "Created: " + message.title;
            $scope.$apply();
        }
        var onMessageDeleted = function (message) {
            console.log(message);
            $scope.action = "Deleted: " + message.title;
            var index = findIndexOfMessage(message);
            console.log(index);
            $scope.messages.splice(index, 1);
            $scope.$apply();
        }
        var onMessageUpdated = function (message) {
            console.log(message);
            $scope.action = "Updated: " + message.title;
            var index = findIndexOfMessage(message);
            $scope.messages[index] = message;
            $scope.$apply();
        }
        var onPriceUpdated = function (message) {
            console.log(message);
            $scope.action = "Updated: " + message.title;
            var index = findIndexOfMessage(message);
            $scope.messages[index] = message;
            $scope.$apply();
        }
        var onRoomJoined = function (data) {
            console.log("Join Room: " + data.room);
            $scope.action = "Join Room: " + data.room;
            $scope.$apply();

            //listening message after join room
             //get messages
            var options = { collectionName: 'messages', action: 'all' };
            PubSub.publish(options, onMessages); //emit
            //listening message change by other user
            PubSub.subscribe({ collectionName: 'message', action: 'created' }, onMessageCreated);//on
            PubSub.subscribe({ collectionName: 'message', action: 'deleted' }, onMessageDeleted);
            PubSub.subscribe({ collectionName: 'message', action: 'updated' }, onMessageUpdated);


            PubSub.subscribe({ collectionName: 'product', action: 'priceUpdated' }, onPriceUpdated);

        }
        $scope.totalMessage = 0;
       

        //join room
        //var rooms = ['notification','product-1'];
        $scope.joinRoom = function(){
            var rooms = $scope.myrooms;
            var options = { collectionName: 'room', action: 'join' };
            PubSub.publish(options, { roomId: rooms }, onRoomJoined);
        }

        $scope.deleteMessage = function () {

        }
        $scope.updateMessage = function () {

        }
        $scope.newMessage = function () {

        }
    }]);
