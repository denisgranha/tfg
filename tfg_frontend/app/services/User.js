/**
 * Created by anger on 3/3/15.
 */

(function() {
    angular.module('frontend')
        .service('User', function ($rootScope, $http) {
            this.signup = function (email, password,name) {

                var url = $rootScope.backend + "user";
                var datos = {
                    email: email,
                    pass: password,
                    name: name
                }

                return $http.post(url, datos);
            }

            this.getAll = function(){
                var url = $rootScope.backend + "user";
                return $http.get(url);
            }
        });
})();