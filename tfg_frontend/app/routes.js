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
                when('/recovery', {
                    templateUrl: 'partials/recovery.html',
                    controller: "RecoveryCtrl"
                }).
                when('/reset/:token', {
                    templateUrl: 'partials/reset.html',
                    controller: "ResetCtrl"
                }).
                when('/admin/unactivated',{
                    templateUrl: 'partials/admin/unactivated.html',
                    controller: "UnactivatedCtrl"
                }).
                when('/patient/:id', {
                   templateUrl: "partials/patient/studies.html",
                    controller: "StudiesCtrl"
                }).
                otherwise({redirectTo: '/login'});
        }])
})();