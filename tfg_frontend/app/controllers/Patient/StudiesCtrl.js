(function(){
    angular.module('frontend')
        .controller('StudiesCtrl',function($scope,Auth,Patient,$routeParams) {
            $scope.location = "Estudio "+ $routeParams.id;

            Patient.get($routeParams.id)
                .success(function(response){
                    $scope.studies = response.content.patients[0].studies;
                })
                .error(function(error){
                    //TODO control?
                    console.log(error);
                });
        });
})();