(function() {
    angular.module('frontend')
        .controller('LoginCtrl', function ($scope, Auth, jwtHelper,$location) {

            $scope.alerts = [];

            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };

            $scope.login = function () {
                Auth.login($scope.email, $scope.password).success(function (result) {
                        if(Auth.isLoggedIn()){
                            $location.path("/home");
                        }
                        else{
                            //TODO Alert
                        }
                    })
                    .error(
                    function (error) {
                        try{
                            if(error == null){
                                $scope.alerts.push(
                                    {
                                        type: 'danger',
                                        msg: 'Servidor fuera de servicio'
                                    }
                                )
                            }
                            else if(error.content.error_code == "user_activation"){
                                $scope.alerts.push(
                                    {
                                        type: 'danger',
                                        msg: 'Su cuenta aún no ha sido activada por un administrador'
                                    }
                                )
                            }
                            else{
                                $scope.alerts.push(
                                    {
                                        type: 'danger',
                                        msg: 'Datos Incorrectos'
                                    }
                                )
                            }
                        }
                        catch(error2){
                            $scope.alerts.push(
                                {
                                    type: 'danger',
                                    msg: 'Error interno'
                                }
                            )
                        }

                    });
            };
        });
})();