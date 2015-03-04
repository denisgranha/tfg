/**
 * Created by anger on 3/3/15.
 */

myApp.service('User',function($rootScope,$http){
    this.signup = function(email,password,callback,error){

        var url = $rootScope.backend + "user";
        var data = {
            email : email,
            pass: password
        }

        $http.post(url,data).success(callback).error(error);
    }
});