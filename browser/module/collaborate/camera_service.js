angular.module('MyApp')
    .service('CameraService', [function(){
  var that = this;

  that.init = function(videoElementId){
    that.video = document.getElementById(videoElementId);
    that.localMediaStream = null;
    that.streaming = false;
    that.videoWidth = null;
    that.videoHeight = null;
  };
  var getUserMedia = function() {
    navigator.getUserMedia = (navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia);
    return navigator.getUserMedia;
  };

  that.hasUserMedia = function() {
    return !!getUserMedia();
  };

  that.startVideoStream = function(options, callback){
    navigator.getUserMedia(options,function(stream){
    if(!that.video){
      return callback("Canvas or Video element not present or initialised");
    }
    if(!stream){
      return callback("Stream is null");
    }
    that.localMediaStream = stream;
    if (navigator.mozGetUserMedia) {
      that.video.mozSrcObject = stream;
    } else {
      var vendorURL = window.URL || window.webkitURL;
      that.video.src = vendorURL.createObjectURL(stream);
    }
    that.video.play();
    that.video.addEventListener('canplay', function(ev){
    if (!that.streaming) {
      that.videoWidth = that.video.videoWidth;
      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.
      if (isNaN(that.video.videoHeight)) {
        that.videoHeight = that.videoWidth / (4/3);
      }
      else{
        that.videoHeight = that.video.videoHeight;
      }
    }
    that.streaming = true;
    return callback(null);
    }, false);
    that.video.onerror = function() {
        return callback("Error in playing video");
    };
        //callback(null);
    },
    function(error){
      callback(error);
    });
  };

  that.stopVideoStream = function(){
    that.localMediaStream.stop();
  };

}]);
