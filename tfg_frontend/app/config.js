/**
 * Created by anger on 23/4/15.
 */
(function(){
    angular.module('frontend')
        .run(
                ['$rootScope', function($rootScope){
                    $rootScope.backend = "http://localhost:3000/";
                }]
            )
        .config(function (jwtInterceptorProvider,$httpProvider) {

            jwtInterceptorProvider.authPrefix = "";
            jwtInterceptorProvider.tokenGetter = ['Auth', function(Auth) {
                return Auth.getToken();
            }];

            $httpProvider.interceptors.push('jwtInterceptor');
        });
})();