(function(){
    angular.module('frontend')
        .controller('PatientsCtrl',function($scope,Auth,Patient) {
            $scope.location = "Pacientes";
            $scope.user = Auth.getUser();

            Patient.get()
                .success(function(response){
                    $scope.patients = response.content.patients;
                })
                .error(function(error){
                    //TODO control?
                    console.log(error);
                });

            $scope.upload = function(file){
                Patient.upload(file)
                    .success(function(result){

                        $scope.alerts.push({ type: 'success', msg: result });
                    })
                    .error(function(error){
                        $scope.alerts.push({ type: 'danger', msg: error });
                    })
            }

            $scope.alerts = [
            ];


            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };
        });
})();