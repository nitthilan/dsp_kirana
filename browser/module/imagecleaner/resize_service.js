angular.module('MyApp')
    .service('ResizeService', ['mySocket', function(mySocket){

    this.canvas = null;
    this.setCanvas = function(canvas){
        this.canvas = canvas;
    };
    this.resize = function(img, width, height, callback){
        var canvas = this.canvas;
        canvas.setDimensions({width:width, height:height});

        // Needed to position background image at 0,0
        canvas.setBackgroundImage(img, function(){
            canvas.renderAll();
            callback(canvas.toDataURL({format:"jpeg"}), null);
        },
        {width:width, height:height, originX: 'left', originY: 'top'});
    };
}]);

