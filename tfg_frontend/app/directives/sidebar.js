(function(){
    angular.module('frontend')
        .directive('sidebar', function() {
            return {
                restrict: 'E',
                transclude: true,
                templateUrl: 'partials/sidebar.html?1'
            };
        });
})();