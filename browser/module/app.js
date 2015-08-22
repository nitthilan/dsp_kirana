var MyApp = angular.module('MyApp', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap',
  'satellizer', 'angularFileUpload', 'btford.socket-io', 'ngProgress', 'ui.select', 'ngSanitize']);

angular.module('MyApp')
    .service('LoginDetectService', function(){
    var that = this;
    that.userloggedin = false;
    that.setLogin = function(){
      that.userloggedin = true;
    };
    that.resetLogin = function(){
      that.userloggedin = false;
    };
    that.isUserLoggedin = function(){
      return that.userloggedin;
    };
});
MyApp.factory('mySocket', ['socketFactory', '$auth', 'LoginDetectService',
  function (socketFactory, $auth, LoginDetectService) {
  var mySocket = socketFactory();
  if ($auth.isAuthenticated()) {
    LoginDetectService.setLogin();
    console.log("Used auto login");
  }
  mySocket.forward('error');
  return mySocket;
}]);

MyApp.config(['$stateProvider', '$urlRouterProvider', '$authProvider', '$locationProvider', '$compileProvider',
  function($stateProvider, $urlRouterProvider, $authProvider, $locationProvider, $compileProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'html/home.html',
        controller: 'HomeCtrl',
        resolve: {
          authenticated: ['$location', '$auth', 'mySocket', function($location, $auth, mySocket) {
            if ($auth.isAuthenticated()) {
              return $location.path('/user_home');
            }
          }]
        }
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('user_home', {
        url: '/user_home',
        templateUrl: 'html/user_home.html',
        controller: 'UserHomeCtrl',
        resolve: {
          authenticated: ['$location', '$auth', 'mySocket', function($location, $auth, mySocket) {
            if (!$auth.isAuthenticated()) {
              return $location.path('/');
            }
          }]
        }
      })
      .state('imagecleaner', {
        url: '/imagecleaner',
        templateUrl: 'html/imagecleaner.html',
        controller: 'ImageCleanerCtrl',
        resolve: {
          authenticated: ['$location', '$auth', function($location, $auth) {
            if (!$auth.isAuthenticated()) {
              return $location.path('/');
            }
          }]
        }
      })
      .state('notebookmaker', {
        url: '/notebookmaker',
        templateUrl: 'html/notebookmaker.html',
        controller: 'NotebookMakerCtrl',
        resolve: {
          authenticated: ['$location', '$auth', function($location, $auth) {
            if (!$auth.isAuthenticated()) {
              return $location.path('/');
            }
          }]
        }
      })
      .state('meeting', {
        url: '/meeting',
        templateUrl: 'html/collaboration/meeting.html',
        controller: 'MeetingCtrl',
        resolve: {
          authenticated: ['$location', '$auth', function($location, $auth) {
            if (!$auth.isAuthenticated()) {
              return $location.path('/');
            }
          }]
        }
      })
      .state('videocapture', {
        url: '/videocapture',
        templateUrl: 'html/collaboration/videocapture.html',
        controller: 'VideocaptureCtrl',
        resolve: {
          authenticated: ['$location', '$auth', function($location, $auth) {
            if (!$auth.isAuthenticated()) {
              return $location.path('/');
            }
          }]
        }
      });
      /*.state('profile', {
        url: '/profile',
        templateUrl: 'module/login/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          authenticated: ['$location', '$auth', function($location, $auth) {
            if (!$auth.isAuthenticated()) {
              return $location.path('/login');
            }
          }]
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'module/login/signup.html',
        controller: 'SignupCtrl'
      }); */
    $authProvider.loginRedirect = '/user_home';
    //$locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $authProvider.facebook({
      clientId: '787479751340055'
    });

    $authProvider.google({
      clientId: '542331465101-qjdso0o95td4ooucs678avsdmsljqaas.apps.googleusercontent.com'
    });

    /*$authProvider.github({
      clientId: '0ba2600b1dbdb756688b'
    });

    $authProvider.linkedin({
      clientId: '77cw786yignpzj'
    });

    $authProvider.twitter({
      url: '/auth/twitter'
    });

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
    }); */

    // http://stackoverflow.com/questions/16514509/how-do-you-serve-a-file-for-download-with-angularjs-or-javascript
    // https://docs.angularjs.org/api/ng/provider/$compileProvider
    //console.log("Old white list"+ $compileProvider.aHrefSanitizationWhitelist());
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):|data:image\//);
}]);

MyApp.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);
