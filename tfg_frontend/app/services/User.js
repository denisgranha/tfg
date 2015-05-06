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
                };

                return $http.post(url, datos);
            };

            this.getAll = function(){
                var url = $rootScope.backend + "user";
                return $http.get(url);
            };

            this.sendRecovery = function(email){
                var url = $rootScope.backend+ "user/recovery";
                return $http.post(url,{email: email});
            };

            this.resetPass = function(token,pass){
                var url = $rootScope.backend + "user/reset";
                return $http.post(url,{token: token, pass: pass});
            };

            this.removeUser = function(user){
                var url = $rootScope.backend + "user/"+user._id;
                return $http.delete(url);
            }

        });
})();