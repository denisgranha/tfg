(function() {
    angular.module('frontend')
        .service('Admin', function ($rootScope, $http, $window, jwtHelper) {
            this.getUnactivatedUsers = function(){
                var url = $rootScope.backend + "admin/unactivated";

                return $http.get(url);
            };

            this.activate = function(user){
                var url = $rootScope.backend + "admin/activate/"+user._id;
                var data = {};

                return $http.post(url,data);
            };
        });
})();