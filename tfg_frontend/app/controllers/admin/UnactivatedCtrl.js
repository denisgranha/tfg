/**
 * Created by anger on 1/5/15.
 */
(function(){
    angular.module('frontend')
        .controller('UnactivatedCtrl',function($scope,Auth,Patient,Admin,User) {

            Admin.getUnactivatedUsers().
                success(function(res){
                    $scope.unactivated = res.content.users;
                });

            $scope.activate = function(user){
                Admin.activate(user).success(function(res){
                    $scope.unactivated.splice($scope.unactivated.indexOf(user),1);
                });
            };

            $scope.removeUser = function(user){
                User.removeUser(user)
                    .success(function(result){
                        var index = $scope.unactivated.indexOf(user);
                        $scope.unactivated.splice(index,1);
                    })
                    .error(function(error){
                        //TODO Alert
                    });
            }

        });
})();