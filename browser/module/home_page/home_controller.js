angular.module('MyApp')
  .controller('HomeCtrl', ['$scope', '$http', '$interval', 'AlertService',
    '$auth', 'LoginDetectService',
    function($scope, $http, $interval, AlertService, $auth, LoginDetectService) {

    $scope.storemailid = function(){
      //console.log("emailvalidation "+JSON.stringify($scope.subscriberForm.email));
      if($scope.email && $scope.subscriberForm.email.$valid){
        //console.log("The correct mail id "+$scope.email);
        $http.post('/api/subscribers', {info:{emailid:$scope.email}});
        $scope.email = "";
      }
    };
    $scope.collate_image = "/static_images/co_after.jpg";
    $scope.collate_image_list = ["/static_images/co_after.jpg", "/static_images/lla_after.jpg", "/static_images/te_after.jpg"];
    $scope.collate_cur_idx = 0;
    $scope.collated_view = function(){
      $scope.collate_image = $scope.collate_image_list[$scope.collate_cur_idx%3];
      $scope.collate_cur_idx++;
    };
    $interval($scope.collated_view, 1250);

    $scope.login = function() {
      $auth.login({ email: "demouser@brightboard.co.in", password: "demouser" })
        .then(function() {
          LoginDetectService.setLogin();
          console.log("Used email and password");
          AlertService.message('You have successfully logged in');
        })
        .catch(function(response) {
          LoginDetectService.setLogoff();
          AlertService.message("Login failed."+response.data.message);
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          LoginDetectService.setLogin();
          console.log("Used google or facebook token");
          AlertService.message('You have successfully logged in');
        })
        .catch(function(response) {
          LoginDetectService.setLogoff();
          AlertService.message("Login failed."+response.data);
        });
    };
  }]);
