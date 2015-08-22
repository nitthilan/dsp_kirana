angular.module('MyApp')
    .service('MeetingInfoService', ['mySocket','$rootScope', 'AlertService',
        function(mySocket, $rootScope, AlertService){

    var that = this;

    that.init = function(){
        that.meeting_info = null;
        mySocket.on('MeetingInfo', function(meeting_info, callback){
            that.meeting_info = meeting_info;
            //console.log("meeting info service updated "+JSON.stringify(meeting_info));
            $rootScope.$apply();
        });
    };
    that.create_meeting = function(){
        mySocket.emit("CreateMeeting", function(error){
            if(error){
                console.log("Create meeting Error"+JSON.stringify(error));
                AlertService.message("Create meeting failed");
            }
        });
    };
    that.join_meeting = function(meeting_id){
        mySocket.emit("JoinMeeting", meeting_id, function(error){
            if(error){
                console.log("Join meeting Error"+JSON.stringify(error));
                AlertService.message("Cannot join meeting");
            }
        });
    };
    that.leave_meeting = function(){
        // Make sure the sharing is stopped before leaving meeting
        mySocket.emit("LeaveMeeting", that.meeting_info._id,
            function(error){
            if(error){
                console.log("Leave meeting Error"+JSON.stringify(error));
                AlertService.message("Leave meeting failed");
            }
        });
    };
}]);
