angular.module('MyApp')
    .service('CameraShareService', ['$interval', 'CameraService', 'VideoCanvasService',
        'mySocket', 'MeetingInfoService','Account',
        function($interval, CameraService, VideoCanvasService, mySocket,
            MeetingInfoService, Account){
    var that = this;

    that.init = function(videoElementId, canvasElementId){
        Account.getProfile(function(account_info){
            that.user_info = account_info.user_info;
        });
        that.camera_image_data = {};
        that.share_promise = null;
        that.active_camera_image_id = null;
        // Initialise dependent modules
        CameraService.init(videoElementId);
        VideoCanvasService.init(canvasElementId, videoElementId, 640, 480, 200);
        that.state = "init";//Used by UI elements to set interactions
    };
    that.receive = function(data){
        var user_info = data.user_info;
        if(that.user_info._id !== user_info._id){
            that.camera_image_data[user_info._id] = null;
            that.camera_image_data[user_info._id] = data;
        }
    };
    that.set_active_view = function(id){
        that.active_camera_image_id = id;
    };

    that.start_preview = function(){
        if(CameraService.hasUserMedia()){
            CameraService.startVideoStream({video: true, audio: false}, function(error){
            //if(error) return callback(error);
            VideoCanvasService.start_image_capture(null);
            });
            that.state = "preview";
        }
        else{
            console.log("Error: No camera support");
        }
    };
    var getAndSendImage = function(imageData){
        var imageInfo = {
            // match(/,(.*)$/)[1] matches everything after a comma.
            //http://stackoverflow.com/questions/7375635/xhr-send-base64-string-and-decode-it-in-the-server-to-a-file
            image: imageData.match(/,(.*)$/)[1],
            //size: "file.size",
            //name: file.name,
            enableclean: 1,//($scope.onlycrop===true)?0:1, // Use integer instead of boolean since this is sent to python
            radius:1,
            threshold:235, //$scope.threshold2],
            topleft:[0,0],
            bottomleft:[0, 480],
            bottomright:[640, 480],
            topright:[640, 0]
        };
        var meeting_id = MeetingInfoService.meeting_info._id;
        var data = {
            meeting_id:meeting_id,
            service:"CameraShareService",
            user_info:that.user_info,
            service_data:{
                imageInfo:imageInfo
            }
        };
        if(that.camera_image_data.preview)
            that.camera_image_data.preview.service_data.image = null;
        that.camera_image_data.preview = data;
        mySocket.emit("SendData", meeting_id, data);
        imageData = null;
    };
    that.stop_preview_and_start_share = function(){
        VideoCanvasService.stop_image_capture();
        VideoCanvasService.start_image_capture(getAndSendImage);
        that.state = "share";
    };
    that.stop_share = function(){
        CameraService.stopVideoStream();
        VideoCanvasService.stop_image_capture();
        that.state = "init";
    };

}]);
