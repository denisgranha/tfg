(function(){
    angular.module('frontend')
        .service('Patient',function($rootScope,$http){
            this.get = function(){
                var url = $rootScope.backend + "patient";
                return $http.get(url);
            };

            this.upload = function(file){
                console.log(file);
                var url = $rootScope.backend + "patient";
                var fd = new FormData();
                fd.append('file_upload', file);

                return $http.post(url,
                    fd,
                    {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    });
            }
        });
})();