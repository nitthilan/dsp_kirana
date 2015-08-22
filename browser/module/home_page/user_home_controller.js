angular.module('MyApp')
  .controller('UserHomeCtrl', ['$scope','$interval','$http', 'Account', 'UserDataInitService',
    function($scope, $interval, $http, Account, UserDataInitService) {
    // Initialise the service into the scope so that it can be used directly in view for databinding
    UserDataInitService.init();
    // View uses the Account service directly
    Account.getProfile(function(userProfile){
    $scope.userProfile = userProfile;
    });
    // required by request_userinfo_jumbotron.html
    $scope.storemailid = function(){
      //console.log("emailvalidation "+JSON.stringify($scope.subscriberForm.email));
      if($scope.email && $scope.subscriberForm.email.$valid){
        //console.log("The correct mail id "+$scope.email);
        $http.post('/api/subscribers', {info:{emailid:$scope.email}});
        $scope.email = "";
      }
    };
    // Run a slide show for clean and collate images
    $scope.collate_image_holder = "/static_images/co_after.jpg";
    $scope.clean_image_holder = "/static_images/clean_colors_before.jpg";
    $scope.collate_image_list = ["/static_images/co_after.jpg", "/static_images/lla_after.jpg", "/static_images/te_after.jpg"];
    $scope.clean_image_list = ["/static_images/clean_colors_before.jpg", "/static_images/clean_colors_after.jpg"];
    $scope.cur_idx = 0;
    $scope.slide_show = function(){
      $scope.collate_image_holder = $scope.collate_image_list[$scope.cur_idx%3];
      $scope.clean_image_holder = $scope.clean_image_list[$scope.cur_idx%2];
      $scope.cur_idx++;
    };
    // https://github.com/angular/protractor/blob/master/docs/timeouts.md $timeout($scope.slide_show, 1250);
    $interval($scope.slide_show, 1250);
  }]);
