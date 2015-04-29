(function() {
    angular.module('frontend')
        .controller('LoginCtrl', function ($scope, Auth, jwtHelper, localStorageService,$location) {

            $scope.alerts = [];

            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };

            $scope.login = function () {
                Auth.login($scope.email, $scope.password, function (result) {
                        localStorageService.set("token", result.content.token);
                        if(Auth.isLoggedIn()){
                            $location.path("/home");
                        }
                        else{
                            //TODO Alert
                        }
                    },
                    function (error) {
                        $scope.alerts.push(
                            {
                                type: 'danger',
                                msg: 'Datos Incorrectos'
                            }
                        )
                    });
            }
        });
})();