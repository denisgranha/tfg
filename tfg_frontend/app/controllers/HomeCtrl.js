(function(){
    angular.module('frontend')
        .controller('HomeCtrl',function($scope,Auth,Patient) {
            $scope.user = Auth.getUser();
            if($scope.user.name)
                $scope.location = "Bienvenido "+$scope.user.name+"!"
            else
                $scope.location = "Bienvenido!"

            Patient.get()
                .success(function(response){
                    $scope.patients = response.content.patients;
                })
                .error(function(error){
                    //TODO control?
                    console.log(error);
                })
    });
})();