
angular.module('MyApp')
    .service('SelectedNotebookService', ['NotebookListService',
        'mySocket',
        function(NotebookListService, mySocket){

    var that = this; // Storing the self pointer as that so everybody uses it directly inside all scopes

    // Initialise all the required data empty
    // Called to re-initialise the service and return the initialised service
    that.init = function(){
        that.selected_notebook = null;
        that.selected_notebook_page_list = [];
        that.selected_notebook_thumbnail = null;
        that.pending_page = null;
    };
    that.create = function(notebook_name, callback){
        if(!that.pending_page){return callback("No page to add to notebook");}
        mySocket.emit("pagesCreate", that.pending_page,
            function(error, createdPageId){
        if(error){return callback("Page creation failed"+JSON.stringify(error));}
        that.pending_page._id = createdPageId;
        var newNotebook = {_id:notebook_name, pagesIdArray:[createdPageId], thumbnailId:createdPageId};
        mySocket.emit("notebooksCreate",
            newNotebook,
            function(error, createdNotebookId){
        if(error){return callback("Notebook creation failed"+JSON.stringify(error));}
        newNotebook._id = createdNotebookId; //update id
        that.selected_notebook = newNotebook;
        that.selected_notebook_page_list = [that.pending_page];
        that.selected_notebook_thumbnail = that.pending_page;
        NotebookListService.add(newNotebook);
        that.pending_page = null;
        return callback(null);
        });
        });
    };
    /*that.create = function(notebook_name, callback){
        mySocket.emit("notebooksCreate", {_id:notebook_name}, function(error, createdNotebookId){
        if(error){
            var errorString = "Error in creating notebook "+JSON.stringify(error);
            console.log(errorString);
            return callback(errorString);
        }
        mySocket.emit("notebooksFindById", createdNotebookId,
            function(error, createdNotebook){
        if(error){
            var errorString = "Error in finding notebook by id "+JSON.stringify(error);
            console.log(errorString);
            return callback(errorString);
        }
        that.selected_notebook = createdNotebook;
        //$scope.notebook_name = null;
        NotebookListService.add(createdNotebook);
        that.selected_notebook_page_list = [];
        that.selected_notebook_thumbnail = null;
        return callback(null);
        });
        });
    };*/

    that.set = function(notebook, callback){
        mySocket.emit("pagesFindByIdArray", notebook.pagesIdArray,
            function(error, pagesList){
        if(error){return callback("Error fetching pages "+JSON.stringify(error));}
        mySocket.emit("pagesFindById", notebook.thumbnailId,
            function(error, thumbnail){
        if(error){return callback("Error fetching thumbnail "+JSON.stringify(error));}
        that.selected_notebook = notebook;
        that.selected_notebook_page_list = pagesList;
        that.selected_notebook_thumbnail = thumbnail;
        if(!that.pending_page) return callback(null);
        mySocket.emit("pagesCreate", that.pending_page,
            function(error, createdPageId){
        if(error){return callback("Error creating page "+JSON.stringify(error));}
        that.pending_page._id = createdPageId;
        that.selected_notebook.pagesIdArray.push(createdPageId);
        mySocket.emit("notebooksFindByIdAndUpdate",that.selected_notebook._id,
            that.selected_notebook,function(error, savedNotebook){
        if(error){return callback("Error saving page to notebook "+JSON.stringify(error));}
        that.selected_notebook_page_list.push(that.pending_page);
        that.pending_page = null;
        return callback(null);
        });
        });
        });
        });
    };

    /*that.set = function(notebook, callback){
        that.selected_notebook = notebook;
        that.selected_notebook_page_list = [];
        that.selected_notebook_thumbnail = null;
        var pagesIdArray = that.selected_notebook.pagesIdArray;
        var addPagesToList = function(pageIdx){
            return function(error, page){
            if(error){
                var errorString = "Error in getting page "+i+" Error "+error;
                console.log(errorString);
                return callback(errorString);
            }
            that.selected_notebook_page_list[pageIdx] = page;
            };
        };
        that.selected_notebook_page_list = new Array(pagesIdArray.length);
        for(var i=0;i<pagesIdArray.length;i++){
            mySocket.emit("pagesFindById", pagesIdArray[i], addPagesToList(i));
        }
        // Add the thumbnail info
        var thumbnailId = that.selected_notebook.thumbnailId;
        if(thumbnailId){
            mySocket.emit("pagesFindById", thumbnailId, function(error, thumbnail){
            if(error){
                var errorString = "Error in getting thumbnail page "+thumbnailId+" Error "+error;
                console.log(errorString);
                return callback(errorString);
            }
            that.selected_notebook_thumbnail = thumbnail;
            });
        }
        callback(null);
    };*/

    that.addPage = function(page, callback){
        mySocket.emit("pagesCreate",page,
            function(error, savedPageId){
        if(error){return callback("Error saving page to notebook "+JSON.stringify(error));}
        page._id = savedPageId;
        that.selected_notebook.pagesIdArray.push(savedPageId);
        mySocket.emit("notebooksFindByIdAndUpdate",
            that.selected_notebook._id, that.selected_notebook,
            function(error, savedNotebook){
        if(error){return callback("Error saving updated notebook "+JSON.stringify(error));}
        that.selected_notebook_page_list.push(page);
        return callback(null);
        });
        });
    };

    that.addPages = function(page_list, callback){
        callback_counter = page_list.length;
        var addToNoteBook = function(page){
            return function(error, savedPageId){
                // Store the page to the notebook
                page._id = savedPageId;
                that.selected_notebook.pagesIdArray.push(savedPageId);
                that.selected_notebook_page_list.push(page);
                // make the upload list empty since all have been uploaded
                callback_counter--;
                if(!callback_counter){
                    mySocket.emit("notebooksFindByIdAndUpdate",
                        that.selected_notebook._id,that.selected_notebook,
                    function(error, savedNotebook){
                    if(error){
                        var errorString = "Error in saving notebook "+error;
                        return callback(errorString, null);
                    }
                    that.selected_notebook = savedNotebook;
                    //$scope.$apply();
                    return callback(null, savedNotebook);
                    });
                }
            };
        };

        for(var i=page_list.length;i>0;i--){
            mySocket.emit(/*"storePage"*/ "pagesCreate",
                page_list[i-1],
                addToNoteBook(page_list[i-1]));
        }
    };
    that.removePage = function(index){
        that.selected_notebook_page_list.splice(index,1);
        that.selected_notebook.pagesIdArray.splice(index,1);
    };
    that.movePageTo = function(curIdx, newIdx){
        if(newIdx >= that.selected_notebook_page_list.length) return;
        if(newIdx < 0) return;
        //console.log("cur "+curIdx+" new "+newIdx);
        // Storing the current and new values
        var curPage = that.selected_notebook_page_list[curIdx];
        var curId = that.selected_notebook.pagesIdArray[curIdx];
        // Delete the current and new values
        that.selected_notebook_page_list.splice(curIdx,1);
        that.selected_notebook.pagesIdArray.splice(curIdx,1);
        // This logic is not requiredif(curIdx<newIdx) newIdx--;
        that.selected_notebook_page_list.splice(newIdx,0,curPage);
        that.selected_notebook.pagesIdArray.splice(newIdx,0,curId);
        return;
    };
    that.save = function(callback){
        mySocket.emit("notebooksFindByIdAndUpdate",that.selected_notebook._id,
            that.selected_notebook,function(error, savedNotebook){
        if(error){
            var errorString = "Error in saving notebook "+error;
            console.log(errorString);
            return callback(errorString);
        }
        // Updating the thumbnail info and using selected_notebook info before update
        NotebookListService.updateThumbnail(that.selected_notebook,
            that.selected_notebook_thumbnail);
        that.selected_notebook = savedNotebook;
        return callback(null);
        });
    };
    that.setThumbnail = function(index){
        if(index >= that.selected_notebook_page_list.length) return;
        if(index < 0) return;
        that.selected_notebook_thumbnail =
            that.selected_notebook_page_list[index];
        that.selected_notebook.thumbnailId =
            that.selected_notebook_thumbnail._id;
    };
    that.addPendingPage = function(page){
        that.pending_page = page;
    };

}]);

