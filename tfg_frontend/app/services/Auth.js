/**
 * Created by denisgranha on 2/3/15.
 */

(function() {
    angular.module('frontend')
        .service('Auth', function ($rootScope, $http, $window, jwtHelper) {

            this.login = function (email, password) {

                var url = $rootScope.backend + "auth";
                var data = {
                    email: email,
                    pass: password
                };

                return $http.post(url, data).success(function(result){
                    $window.localStorage.setItem("token",result.content.token);
                });
            };

            this.isLoggedIn = function () {
                var token = $window.localStorage.getItem("token");
                if (token == null || token == undefined || token == "") {
                    return false;
                }
                else {
                    return !jwtHelper.isTokenExpired(token)
                }

            };

            this.getToken = function(){
                return $window.localStorage.getItem("token");
            };

            this.getUser = function(){
                return jwtHelper.decodeToken($window.localStorage.getItem("token"));
            };

            this.logout = function(){
                $window.localStorage.removeItem("token");
            }

        });
})();