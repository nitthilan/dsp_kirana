angular.module('MyApp')
  .controller('ImageCleanerCtrl',
    ['$scope', 'mySocket', 'ngProgress', 'Account', 'ResizeService',
    'UserDataInitService', 'SelectedNotebookService', 'AlertService',
    function($scope, mySocket, ngProgress, Account, ResizeService,
      UserDataInitService, SelectedNotebookService, AlertService) {

    // Initialise the service into the scope so that it can be used directly in view for databinding
    UserDataInitService.init();
    // View uses the Account service directly
    Account.getProfile(function(userProfile){
    $scope.userProfile = userProfile;
    });
    //$scope.NotebookListService = NotebookListService;
    $scope.SelectedNotebookService = SelectedNotebookService;

    $scope.process_state = 0;

    $scope.getScriptParam = function(file){
      var topleft = $scope.topleft.getPointByOrigin('center','center');
      var bottomleft = $scope.bottomleft.getPointByOrigin('center','center');
      var bottomright = $scope.bottomright.getPointByOrigin('center','center');
      var topright = $scope.topright.getPointByOrigin('center','center');
      var xscale = ($scope.image_width*1.0)/$scope.canvas_width;
      var yscale = ($scope.image_height*1.0)/$scope.canvas_height;
      //console.log(xscale+" "+yscale);
      return{
        // match(/,(.*)$/)[1] matches everything after a comma.
        //http://stackoverflow.com/questions/7375635/xhr-send-base64-string-and-decode-it-in-the-server-to-a-file
        image: $scope.input_preview.match(/,(.*)$/)[1],
        size: file.size,
        name: file.name,
        enableclean: ($scope.onlycrop===true)?0:1, // Use integer instead of boolean since this is sent to python
        radius:$scope.radius1,
        threshold:$scope.threshold1, //$scope.threshold2],
        topleft:[topleft.x*xscale, topleft.y*yscale],
        bottomleft:[bottomleft.x*xscale, bottomleft.y*yscale],
        bottomright:[bottomright.x*xscale, bottomright.y*yscale],
        topright:[topright.x*xscale, topright.y*yscale]
      };
    };
    $scope.setImageDimensions = function(width, height){
      $scope.image_width = width; $scope.image_height = height;
      var canvas_width = $scope.canvas_width;
      var canvas_height = (height * $scope.canvas_width)/width;
      $scope.canvas_height = canvas_height;
      $scope.topleft.setPositionByOrigin(new fabric.Point(0, 0), 'center', 'center');
      $scope.bottomleft.setPositionByOrigin(new fabric.Point(0, canvas_height), 'center', 'center');
      $scope.bottomright.setPositionByOrigin(new fabric.Point(canvas_width, canvas_height), 'center', 'center');
      $scope.topright.setPositionByOrigin(new fabric.Point(canvas_width, 0), 'center', 'center');
      $scope.inputCanvas.renderAll();
      //console.log("Width and height of canvas "+canvas_width+" "+canvas_height);
    };
    $scope.initParams = function(){
      $scope.radius1 = 1; //$scope.radius2 = 11;
      $scope.threshold1 = 225; //$scope.threshold2 = 200;
      $scope.onlycrop = false;
    };
    $scope.input_preview = "/static_images/sample_512.jpg";
    $scope.output_preview = "/static_images/sample_512_output.jpg";
    $scope.canvas_width = 540;

    // Static canvas is used for disabling selection
    var canvas = new fabric.Canvas('inputCanvas',{
      stateful: false,
      allowTouchScrolling: true
    });
    $scope.inputCanvas = canvas;
    var SetCoordinate = function(offX, offY) {
      if(offX < $scope.canvas_width/2 && offY < $scope.canvas_height/2){
        $scope.topleft.setPositionByOrigin(new fabric.Point(offX, offY), 'center', 'center');
      }
      else if(offX >= $scope.canvas_width/2 && offY >= $scope.canvas_height/2){
        $scope.bottomright.setPositionByOrigin(new fabric.Point(offX, offY), 'center', 'center');
      }
      else if(offX < $scope.canvas_width/2 && offY >= $scope.canvas_height/2){
        $scope.bottomleft.setPositionByOrigin(new fabric.Point(offX, offY), 'center', 'center');
      }
      else{
        $scope.topright.setPositionByOrigin(new fabric.Point(offX, offY), 'center', 'center');
      }
      $scope.inputCanvas.renderAll();

    };
    canvas.on('mouse:down', function(options){
      /*console.log(options);
      console.log($scope.inputCanvas);
      console.log(window.pageXOffset, window.pageYOffset);
      console.log($scope.inputCanvas._offset, $scope.canvas_width, $scope.canvas_height);*/
      if(options.e.type === 'touchstart'){
        //console.log(options.e.touches[0].clientX, options.e.touches[0].clientY);
        var offX = options.e.touches[0].clientX+window.pageXOffset-$scope.inputCanvas._offset.left;
        var offY = options.e.touches[0].clientY+window.pageYOffset-$scope.inputCanvas._offset.top;
        //console.log(offX, offY);
        SetCoordinate(offX, offY);
      }
      else{
        //console.log(options.e.offsetX, options.e.offsetY);
        SetCoordinate(options.e.offsetX, options.e.offsetY);
      }
    });
    canvas.on('touch:drag', function(options){
      console.log(options);

      //var offX = options.e.offsetX, offY = options.e.offsetY;
    });
    //canvas.on('touch:gesture', SetCoordinate);
    //canvas.on('touch:drag', SetCoordinate);
    $scope.topleft = new fabric.Circle({radius: 5, fill: 'green'});
    $scope.topright = new fabric.Circle({radius: 5, fill: 'green'});
    $scope.bottomright = new fabric.Circle({radius: 5, fill: 'green'});
    $scope.bottomleft = new fabric.Circle({radius: 5, fill: 'green'});
    $scope.topleft.selectable = false; $scope.topright.selectable = false;
    $scope.bottomright.selectable = false; $scope.bottomleft.selectable = false;
    $scope.inputCanvas.add($scope.topleft);$scope.inputCanvas.add($scope.topright);
    $scope.inputCanvas.add($scope.bottomright);$scope.inputCanvas.add($scope.bottomleft);
    $scope.setImageDimensions(512, 315);
    $scope.initParams();


    //var outputCanvas = new fabric.Canvas('outputCanvas');
    //outputCanvas.backgroundImage = "/static_images/sample_512_output.jpg";

    $scope.$on('socket:error', function (ev, data) {
      console.log("Socket error "+JSON.stringify(data));
    });
    $scope.canvas = new fabric.Canvas('imgResizeCanvas');
    ResizeService.setCanvas($scope.canvas);

    $scope.preview = function(fileList) {
      //console.log(fileList);
      var reader = new FileReader();
      reader.onload = function(){
        var img = new Image();
        img.src = reader.result;
        var height = (img.height*1024)/img.width;
        var width = 1024;
        ResizeService.resize(reader.result, width, height,
          function(resized_image, error){
        //console.log(thumbnail);
        $scope.input_preview = resized_image;
        $scope.page_name = fileList[0].name;
        $scope.image_width = width;$scope.image_height = height;
        //console.log("Image width and height "+img.width+" "+img.height);
        $scope.setImageDimensions(width, height);
        var canvas = $scope.inputCanvas;
        var canvas_height = (height * $scope.canvas_width)/ width;
        canvas.setDimensions({width:$scope.canvas_width , height:(canvas_height)});
        canvas.setBackgroundImage($scope.input_preview,
          canvas.renderAll.bind(canvas),
          { width: canvas.width, height: canvas.height,
          // Needed to position backgroundImage at 0/0
          originX: 'left', originY: 'top'});
        $scope.process_state = 1;
        $scope.$apply();
        });
      };
      reader.onerror = function(){
        console.log(console.result);
      };
      reader.readAsDataURL(fileList[0]);
    };
    $scope.upload = function(fileList){
      //console.log(fileList);
      ngProgress.start();

      var file = fileList[0];
      //console.log(JSON.stringify($scope.getScriptParam(file)));
      mySocket.emit("correctPrespective", $scope.getScriptParam(file),
        function(error,output){
          if(error){
            console.log(error);
          }
          else{
            $scope.output_preview = "data:image/png;base64,"+output;
            $scope.process_state = 2;
          }
          ngProgress.complete();
      });
    };
    $scope.addPageToNotebook = function(){
      ResizeService.resize($scope.output_preview, 100, 100,
        function(thumbnail, error){
      var page = {
        displayName:$scope.page_name,
        data:$scope.output_preview,
        thumbnail:thumbnail
      };
      //console.log(pageList);
      SelectedNotebookService.addPage(page, function(error){
        if(error){
          AlertService.message('Unable to save page '+$scope.page_name);
        }
        else{
          AlertService.message($scope.page_name+' saved to '+SelectedNotebookService.selected_notebook._id);
          $scope.process_state = 0;
        }
      });
      });
    };
    $scope.addPageToPending = function(){
      ResizeService.resize($scope.output_preview, 100, 100,
        function(thumbnail, error){
      SelectedNotebookService.addPendingPage({
        displayName:$scope.page_name,
        data:$scope.output_preview,
        thumbnail:thumbnail
      });
      });
    };
  }]);
