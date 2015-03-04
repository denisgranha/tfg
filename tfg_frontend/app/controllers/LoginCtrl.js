myApp.controller('LoginCtrl',function($scope,Auth,jwtHelper) {

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.login = function(){
        Auth.login($scope.email,$scope.password,function(result){
            console.log(jwtHelper.decodeToken(result.content.token));
        },
        function(error){
            $scope.alerts.push(
                {
                    type: 'danger',
                    msg: 'Datos Incorrectos'
                }
            )
        });
    }
});