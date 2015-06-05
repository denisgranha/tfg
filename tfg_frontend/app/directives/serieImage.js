/**
 * Created by anger on 14/5/15.
 */

(function(){
    angular.module('frontend')
        .directive('serieImage', function() {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    cornerstone.enable(element[0]);
                    attr.$observe('serieImage', function(value){
                        if(value){
                            var imageId = "dicomweb:http://localhost:3000/image/"+value;

                            cornerstone.loadAndCacheImage(imageId).then(function(image) {
                                cornerstone.displayImage(element[0], image);

                            });
                        }
                    });


                }
            };
        });
})();