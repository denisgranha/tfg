/**
 * Created by anger on 23/4/15.
 */
(function(){
    angular.module('frontend')
        .controller('SideBarCtrl',function($scope,$cookieStore,Auth,Admin,$location){
            /**
             * Sidebar Toggle & Cookie Control
             */
            var mobileView = 992;

            $scope.user = Auth.getUser();

            if($scope.user.isAdmin){
                Admin.getUnactivatedUsers().
                    success(function(res){
                        $scope.unactivated = res.content.users;
                    })
            }

            $scope.getWidth = function() {
                return window.innerWidth;
            };

            $scope.$watch($scope.getWidth, function(newValue, oldValue) {
                if (newValue >= mobileView) {
                    if (angular.isDefined($cookieStore.get('toggle'))) {
                        $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
                    } else {
                        $scope.toggle = true;
                    }
                } else {
                    $scope.toggle = false;
                }

            });

            $scope.toggleSidebar = function() {
                $scope.toggle = !$scope.toggle;
                $cookieStore.put('toggle', $scope.toggle);
            };

            window.onresize = function() {
                $scope.$apply();
            };

            $scope.logout = function(){
                Auth.logout();
                $location.path("#login");
            }
        });
})();