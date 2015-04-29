(function() {
    angular.module('frontend')
        .controller('SignUpCtrl', function ($scope, Auth, User, $location) {

            $scope.signup = function () {
                User.signup($scope.email, $scope.password,$scope.name)
                    .success(function(result){
                        $location.path("login");
                    })
                    .error(function(error){
                        //TODO Alert
                    });
            }
        });
})();