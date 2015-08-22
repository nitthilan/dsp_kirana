angular.module('MyApp')
    .service('AlertService', ['$alert', function($alert){

    var that = this;

    that.message = function(message){
        $alert({
            content: message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
        });
    };
}]);

