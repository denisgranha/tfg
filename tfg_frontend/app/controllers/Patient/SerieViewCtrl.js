(function() {
    angular.module('frontend')
        .controller('SerieViewCtrl', function ($scope, Auth, Patient, $routeParams,$document) {

            $scope.location = "Serie "+$routeParams.serieId;
            $scope.dicom = [];
            $scope.image = {
                index : 0
            };

            Patient.getSerie($routeParams.patientId,$routeParams.studyId,$routeParams.serieId)
            .success(function(response){
                $scope.dicom = response.content.images;

                $scope.image.id = $scope.dicom[$scope.image.index].imageId;
            });

            $scope.move = function(e){

                var element = document.getElementById('dicomContainer');
                var lastX = e.pageX;
                var lastY = e.pageY;


                $document.bind('mousemove',function (e) {
                    var deltaX = e.pageX - lastX,
                        deltaY = e.pageY - lastY;
                    lastX = e.pageX;
                    lastY = e.pageY;

                    var viewport = cornerstone.getViewport(element);
                    viewport.translation.x += (deltaX / viewport.scale);
                    viewport.translation.y += (deltaY / viewport.scale);
                    cornerstone.setViewport(element, viewport);
                });

                $document.bind('mouseup',function (e) {
                    $document.unbind('mousemove');
                    $document.unbind('mouseup');
                });
            };

            $scope.zoom = function(e){
                // Firefox e.originalEvent.detail > 0 scroll back, < 0 scroll forward
                // chrome/safari e.originalEvent.wheelDelta < 0 scroll back, > 0 scroll forward
                var element = document.getElementById('dicomContainer');
                if (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) {
                    var viewport = cornerstone.getViewport(element);
                    viewport.scale += 0.05;
                    cornerstone.setViewport(element, viewport);
                } else {
                    var viewport = cornerstone.getViewport(element);
                    viewport.scale -= 0.05;
                    cornerstone.setViewport(element, viewport);
                }
                //prevent page fom scrolling
                return false;
            };

            $scope.$watch('image.index',function(){
                if($scope.dicom.length > 0){
                    $scope.image.id = $scope.dicom[$scope.image.index].imageId;
                }
            });
        });
})();