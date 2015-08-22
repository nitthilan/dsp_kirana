angular.module('MyApp')
    .service('VideoCanvasService', ['$interval', function($interval){
    var that = this;
    that.init = function(canvas_element_id, video_element_id, width, height, frameInterval){
        that.canvas_element_id = canvas_element_id;
        that.video_element_id = video_element_id;
        that.width = width;
        that.height = height;
        that.frameInterval = frameInterval;
        that.interval_promise = null;
    };

    that.start_image_capture = function(callback){
        var canvas = document.getElementById(that.canvas_element_id);
        var video = document.getElementById(that.video_element_id);
        canvas.setAttribute('width', that.width);
        canvas.setAttribute('height', that.height);
        var context = canvas.getContext('2d');
        var sample_video = function(){
            context.drawImage(video, 0, 0,
                that.width, that.height);
            if(callback){
                that.image = canvas.toDataURL("image/jpeg", 0.5);
                callback(that.image);
                that.image = null;
            }
            return null;
        };
        that.interval_promise = $interval(sample_video, that.frameInterval);
    };
    that.stop_image_capture = function(){
        $interval.cancel(that.interval_promise);
        that.interval_promise = null;
    };
}]);
