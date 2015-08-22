angular.module('MyApp')
    .service('ChatService', ['mySocket', 'Account', 'MeetingInfoService',
        function(mySocket, Account, MeetingInfoService){

    var that = this;
    that.init = function(){
        Account.getProfile(function(account_info){
            that.user_info = account_info.user_info;
        });
        that.message_list = [];
    };
    that.receive = function(data){
        //if(data.meeting_id)
        that.message_list.push(data);
    };
    that.send_message = function(message_text){
        var meeting_id = MeetingInfoService.meeting_info._id;
        var data = {
            meeting_id:meeting_id,
            service:"ChatService",
            user_info:that.user_info,
            service_data:{
                text:message_text
            }
        };
        mySocket.emit("SendData", meeting_id, data);
    };
}]);
