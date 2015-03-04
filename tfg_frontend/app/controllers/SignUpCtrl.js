myApp.controller('SignUpCtrl',function($scope,Auth,User,jwtHelper) {

    $scope.signup = function(){
        User.signup($scope.email,$scope.password,function(result){
            console.log(result);
        },
        function(error){
            console.log("error");
        });
    }
});