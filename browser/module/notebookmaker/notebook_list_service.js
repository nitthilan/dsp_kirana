angular.module('MyApp')
    .service('NotebookListService', ['mySocket',function(mySocket){

    var that = this;

    // Initialise all the required data empty
    // notebook list
    that.init = function(){
        that.notebook_list = [];
        that.notebook_list_thumbnail = [];
        // Load the notebook already in the database
        mySocket.emit("notebooksFind", {}, '', function(error, notebook_list_server){
        if(error){
            console.log("Error in getting notebooks "+error);
            return;
        }
        //console.log("The notebok list "+JSON.stringify(notebook_list));
        that.notebook_list = notebook_list_server;
        //console.log("Notebook list "+JSON.stringify(notebook_list));

        var fillThumbnailFn = function(index){
            return function(error, thumbnailPage){
                if(error){
                    console.log("Error in getting thumbnail "+i+" Error "+error);
                    return;
                }
                //console.log("The thumbnail page "+thumbnailPage);
                that.notebook_list_thumbnail[index] = thumbnailPage;
            };
        };
        that.notebook_list_thumbnail = new Array(notebook_list_server.length);
        for(var i=0;i<notebook_list_server.length;i++){
            var thumbnailId = notebook_list_server[i].thumbnailId;
            mySocket.emit("pagesFindById", thumbnailId, fillThumbnailFn(i));
        }
        });
    };
    that.add = function(notebook){
        return that.notebook_list.push(notebook);
    };
    that.updateThumbnail = function(selected_notebook, selected_notebook_thumbnail){
        // Updating the thumbnail info and using selected_notebook info before update
        // console.log($scope.notebook_list.indexOf($scope.selected_notebook));
        that.notebook_list_thumbnail
            [that.notebook_list.indexOf(selected_notebook)] =
            selected_notebook_thumbnail;
    };


}]);
