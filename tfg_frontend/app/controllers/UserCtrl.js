(function(){
    angular.module('frontend')
        .controller('UserCtrl',function($scope,Auth,User) {
            $scope.location = "Usuarios";
            $scope.user = Auth.getUser();


            User.getAll()
                .success(function(response){
                    $scope.users = response.content.users;
                })
                .error(function(error){
                    //TODO control?
                    console.log(error);
                });

            $scope.alerts = [
            ];


            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };
        });
})();