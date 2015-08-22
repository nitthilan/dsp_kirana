angular.module('MyApp')
  .controller('NotebookMakerCtrl', ['$scope', 'mySocket',
    'ngProgress',  'Account', 'ResizeService', 'NotebookListService',
    'SelectedNotebookService', 'UserDataInitService',
    function($scope, mySocket, ngProgress, Account,
        ResizeService, NotebookListService, SelectedNotebookService,
        UserDataInitService) {

    // Initialise the service into the scope so that it can be used directly in view for databinding
    UserDataInitService.init();
    // View uses the Account service directly
    Account.getProfile(function(userProfile){
    $scope.userProfile = userProfile;
    });
    $scope.NotebookListService = NotebookListService;
    $scope.SelectedNotebookService = SelectedNotebookService;

    $scope.process_state = 0;

    // Create or Select already existing notebook
    $scope.createNotebook = function(notebook_name){
        if(notebook_name === "" || notebook_name === null) return;
        SelectedNotebookService.create(notebook_name, function(error){
        if(error){console.log(error); return;}
        $scope.notebook_name = null;
        $scope.process_state = 1;
        });
    };

    $scope.selectNotebook = function(notebook){
        SelectedNotebookService.set(notebook, function(error){
        if(error){console.log(error); return;}
        $scope.notebook_name = null;
        $scope.process_state = 1;
        });
    };

    // Add new pages to notebook related
    $scope.canvas = new fabric.Canvas('imgResizeCanvas');
    ResizeService.setCanvas($scope.canvas);
    /*$scope.upload_page_list = [];// List of pages to be added to the file
    $scope.addPages = function(fileList) {
        for(var i=0;i<fileList.length;i++){
            $scope.fileLoader(fileList[i]);
        }
    };
    $scope.fileLoader = function(file){
        var reader = new FileReader();
        reader.onload = function(){
            ResizeService.resize(reader.result, 100, 100, function(thumbnail, error){
            //console.log(thumbnail);
            $scope.upload_page_list.push({
                displayName:file.name,
                data:reader.result,
                thumbnail:thumbnail
                });
            $scope.$apply();
            });
        };
        reader.onerror = function(){
            console.log(console.result);
        };
        reader.readAsDataURL(file);
    };
    $scope.removePage = function(index){
        $scope.upload_page_list.splice(index,1);
    };
    $scope.discardPages = function(){
        $scope.upload_page_list = [];
    };
    $scope.saveToNotebook = function(){
        SelectedNotebookService.addPages($scope.upload_page_list, function(error){
        $scope.upload_page_list = [];
        $scope.$apply();
        });
    };*/

    // Notebook editing related
    $scope.deletePage = function(index){
        SelectedNotebookService.removePage(index);
        $scope.save_notebook_button = 1;
    };
    $scope.setThumbnail = function(index){
        SelectedNotebookService.setThumbnail(index);
        $scope.save_notebook_button = 1;
    };
    $scope.movePageTo = function(curIdx, newIdx){
        SelectedNotebookService.movePageTo(curIdx, newIdx);
        // Adding the values in the swapped position
        $scope.save_notebook_button = 1;
        newIdx = null;
    };
    $scope.saveNotebook = function(){
        SelectedNotebookService.save(function(error){
        if(error) return;
        $scope.save_notebook_button = 0;
        });
    };

    // Presentation panel related
    $scope.cur_page_position = 0;
    $scope.prevPage = function(){
        var total_pages = SelectedNotebookService.selected_notebook_page_list.length;
        $scope.cur_page_position--;
        if($scope.cur_page_position < 0){
            $scope.cur_page_position = total_pages-1;
        }
    };
    $scope.nextPage = function(){
        var total_pages = SelectedNotebookService.selected_notebook_page_list.length;
        $scope.cur_page_position++;
        if($scope.cur_page_position >= total_pages){
            $scope.cur_page_position = 0;
        }
    };
}]);
