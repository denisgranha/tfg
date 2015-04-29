/**
 * Created by anger on 23/4/15.
 */
(function(){
    angular.module('frontend')
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/login', {
                    templateUrl: 'partials/login.html?1',
                    controller: 'LoginCtrl'
                }).
                when('/signup', {
                    templateUrl: 'partials/signup.html?1',
                    controller: 'SignUpCtrl'
                }).
                when('/home', {
                    templateUrl: 'partials/home.html?1',
                    controller: 'HomeCtrl'
                }).
                when('/patients', {
                   templateUrl: 'partials/patients.html?1',
                    controller: 'PatientsCtrl'
                }).
                when('/users', {
                   templateUrl: 'partials/users.html?1',
                    controller: 'UserCtrl'
                }).
                otherwise({redirectTo: '/login'});
        }])
})();