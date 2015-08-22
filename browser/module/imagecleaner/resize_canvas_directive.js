angular.module('MyApp')
.directive( 'resizeCanvas', function($window) {

    return {
        link: function( scope, elem, attrs ) {
          scope.getWidth = function () {
            return  elem.width();
          };
          scope.$watch(scope.getWidth, function (newValue, oldValue) {
            //console.log("new and old values "+ newValue + " "+oldValue);
            var newWidth = newValue-10;
            scope.canvas_width = newWidth;
            var newHeight = (scope.image_height * newWidth) / scope.image_width;
            scope.canvas_height = newHeight;
            scope.inputCanvas.setDimensions({width:newWidth, height:newHeight});
            var canvas = scope.inputCanvas;
            canvas.setBackgroundImage(scope.input_preview, canvas.renderAll.bind(canvas),
              {
              width: canvas.width,
              height: canvas.height,
              // Needed to position backgroundImage at 0/0
              originX: 'left',
              originY: 'top'
            });
          }, true);
          var w = angular.element($window);
          w.bind('resize', function () {
            //console.log("Window has been resized");
            scope.$apply();
          });
        }
    };

} );
