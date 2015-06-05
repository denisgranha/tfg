(function(){
    angular.module('frontend')
        .service('Patient',function($rootScope,$http){
            this.getAll = function(){
                var url = $rootScope.backend + "patient";
                return $http.get(url);
            };

            this.get = function(id){
                var url = $rootScope.backend + "patient/"+id;
                return $http.get(url);
            };

            this.getSerie = function(patient,study,serie){
                var url = $rootScope.backend + "patient/"+patient+"/study/"+study+"/serie/"+serie;
                return $http.get(url);
            };

            this.removePatient = function(id){
                var url = $rootScope.backend + "patient/"+id;
                return $http.delete(url);
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
            };
        });
})();