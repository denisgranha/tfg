/**
 * Created by denisgranha on 2/3/15.
 */

(function() {
    angular.module('frontend')
        .service('Auth', function ($rootScope, $http, localStorageService, jwtHelper) {

            this.login = function (email, password, callback, error) {

                var url = $rootScope.backend + "auth";
                var data = {
                    email: email,
                    pass: password
                };

                $http.post(url, data).success(callback).error(error);
            }

            this.isLoggedIn = function () {
                var token = localStorageService.get("token");
                if (token == null) {
                    return false;
                }
                else {
                    return !jwtHelper.isTokenExpired(token)
                }

            }

            this.getUser = function(){
                return jwtHelper.decodeToken(localStorageService.get("token"));
            }


        });
})();