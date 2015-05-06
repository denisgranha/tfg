(function(){
    angular.module('frontend')
        .controller('ResetCtrl',function($scope,User,$location,$routeParams) {
            $scope.alerts = [];

            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };

            $scope.resetPass = function(){
                User.resetPass($routeParams.token,$scope.pass).
                    success(function(result){
                        console.log(result);
                        $location.path("#login");
                    })
                    .error(function(error){
                        console.log(error);
                        $scope.alerts.push({'type': "danger", msg: error.content.description});
                    });
            }
        });
})();