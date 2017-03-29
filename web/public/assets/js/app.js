var app = angular.module('myapp', ['ngCookies', 'Contact','Auth','Notify']).config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
});