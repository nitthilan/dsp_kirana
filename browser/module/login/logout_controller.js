angular.module('MyApp')
  .controller('LogoutCtrl', function($auth, AlertService, mySocket) {
    if (!$auth.isAuthenticated()) {
        return;
    }
    $auth.logout()
      .then(function() {
        mySocket.disconnect();
        AlertService.message('You have been logged out');
      });
  });
