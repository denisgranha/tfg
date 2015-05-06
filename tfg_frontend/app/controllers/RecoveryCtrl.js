(function(){
    angular.module('frontend')
        .controller('RecoveryCtrl',function($scope,User) {
            $scope.alerts = [];

            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };

            $scope.sendRecovery = function(){
                User.sendRecovery($scope.email).
                    success(function(result){
                        $scope.alerts.push({'type': "success", msg: "Revise su correo electrónico"});
                    })
                    .error(function(error){
                        $scope.alerts.push({'type': "danger", msg: error.content.description});
                    });
            }
        });
})();