var shortId = require('shortid');

// Storing the list of meeting active in the server
var meeting_list = {};
module.exports = function (socket, config, io) {
    var log = require(config.root+'./setup/log.js').appLogger;
    var meetingInfoRouter = require(config.root+'./collaboration/meetingDataRouter.js')(config);
    var userId = socket.decoded_token.sub;
    var CreateMeeting = function(callback){
        var meeting_id = shortId.generate();
        meeting_list[meeting_id] = {};
        JoinMeeting(meeting_id, callback);
    }
    var JoinMeeting = function(meeting_id, callback){
        if(!(meeting_id in meeting_list)) return callback("No meeting with the id found", null);
        socket.join(meeting_id);
        meeting_list[meeting_id][userId] = true;
        io.to(meeting_id).emit('MeetingInfo',
            {_id:meeting_id, participantsIdArray: meeting_list[meeting_id]});
        callback(null, meeting_list[meeting_id]);
    }
    var LeaveMeeting = function(meeting_id, callback){
        socket.leave(meeting_id);
        if(!(meeting_id in meeting_list)) return callback("No such meeting id", null);
        delete meeting_list[meeting_id][userId];
        io.to(meeting_id).emit('MeetingInfo',
            {_id:meeting_id, participantsIdArray: meeting_list[meeting_id]});
        callback(null, meeting_list[meeting_id]);
    }
    var SendData = function(meeting_id, data){
        if(!(meeting_id in meeting_list))
            return log.error("Meeting id not present");
        //log.info("Inside Send data");
        meetingInfoRouter.routeData(data, function(error, processedData){
            if(error) return log.error("Error in processing data");
            return io.to(meeting_id).emit('ReceiveData', processedData);
        });
    }
    socket.on("CreateMeeting", CreateMeeting);
    socket.on("JoinMeeting", JoinMeeting);
    socket.on("LeaveMeeting", LeaveMeeting);
    //socket.on("StartSharing", StartSharing);
    //socket.on("StopSharing", StopSharing);
    socket.on("SendData", SendData);
}
