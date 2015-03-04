/**
 * Created by denisgranha on 2/3/15.
 */

myApp.service('Auth', function($rootScope,$http) {

    this.login = function(email,password,callback,error){

        var url = $rootScope.backend + "auth";
        var data = {
            email : email,
            pass: password
        };

        $http.post(url,data).success(callback).error(error);
    }


});