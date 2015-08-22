angular.module('MyApp')
  .controller('MeetingCtrl',['$scope','Account', 'mySocket','MeetingInfoService',
    'UserDataInitService', 'ChatService', 'CameraShareService',
    function($scope, Account, mySocket, MeetingInfoService,
        UserDataInitService, ChatService, CameraShareService) {

    UserDataInitService.init();
    // View uses the Account service directly
    Account.getProfile(function(userProfile){
    $scope.userProfile = userProfile;
    });

    $scope.view_state = 0;
    $scope.MeetingInfoService = MeetingInfoService;
    $scope.ChatService = ChatService;
    $scope.CameraShareService = CameraShareService;
    CameraShareService.init('cam_capture_video','cam_capture_canvas');
}]);

//  http://stackoverflow.com/questions/15266671/angular-ng-repeat-in-reverse
angular.module('MyApp').filter('array_reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
