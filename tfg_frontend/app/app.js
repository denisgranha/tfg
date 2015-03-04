'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
    'ngRoute',
    'ui.bootstrap',
    'angular-jwt'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/login', {
          templateUrl: 'partials/login.html',
          controller: 'LoginCtrl'
      }).
      when('/signup', {
          templateUrl: 'partials/signup.html',
          controller: 'SignUpCtrl'
      }).
      otherwise({redirectTo: '/login'});
}]).run(
    ['$rootScope', function($rootScope){
        $rootScope.backend = "http://localhost:3000/";
    }]
);

