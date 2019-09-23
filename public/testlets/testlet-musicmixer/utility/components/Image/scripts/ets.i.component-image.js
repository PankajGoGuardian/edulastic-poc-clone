(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Image Component******************/

  object.ETS.i.component.image = function(obj) {
    console.log("create image component...");
    console.log(obj);

    //Map all the pointers for param.json file
    var imageId = obj.identity.id + "-txt";
    var modalId = obj.identity.id + "-myModal";
    var modalImg = obj.identity.id + "-modalImage";
    var modalClose = obj.identity.id + "-close";
    var zoomCaption = obj.identity.id + "-caption";
    var imgSrc = "assets/img/" + idMapContent(obj.properties.src);
    var altTxt = idMapContent(obj.properties.alt);
    var imgName = idMapContent(obj.identity.name);
    var responseId = idMapContent(obj.identity.responseId);
    var imageCaption = obj.properties.caption;

    //Create the image component
    //All the properties have been declared dynamically and it will be loaded through the JSON file.
    var str = "";

    var imgCap = "";
    if (typeof imageCaption !== typeof undefined && imageCaption.length > 0) {
      imgCap = '<div class="caption">' + imageCaption + "</div>";
    }

    $("#" + obj.identity.id).html(
      '<div class="imageWrapper"><img src="' +
        imgSrc +
        '" id="' +
        imageId +
        '" alt="' +
        altTxt +
        '" tabindex="' +
        obj.properties.tabindex +
        '" class="' +
        obj.properties.class +
        '" role="img" name="' +
        imgName +
        '" /></img>' +
        imgCap +
        "</div>"
    );
    var imageDiv = $("#" + imageId);

    if (obj.properties.zoom === true) {
      str += '<div id="' + modalId + '" class="imageModal hidden">';
      str += '<div class="background"></div>';
      str += '<div class="win">';
      str += '<span id="' + modalClose + '" class="close" aria-label="close modal" role="button" tabindex="1"></span>'; //PZ
      str +=
        '<img role="img" class="content" id="' +
        modalImg +
        '" alt="This is the zoomed in view of the image: ' +
        altTxt +
        '" />'; //PZ
      if (typeof zoomCaption !== typeof "undefined") {
        //PZ
        str += '<div id="' + zoomCaption + '" class="caption"><caption></caption></div>'; //PZ
      }
      str += "</div>"; //PZ
    }

    $("#" + obj.identity.id).append(str);

    //Set the height and width for the image
    var objWidth = idMapContent(obj.properties.width);
    var objHeight = idMapContent(obj.properties.height);

    $("#" + imageId).css("width", objWidth + "px");
    $("#" + imageId).css("height", objHeight + "px");

    //Set the zoom icone requirements // PZ
    if (obj.properties.zoom === true) {
      $("#" + imageId).wrap(
        '<div id="' +
          imageId +
          '-container" class="imageContainer" style="width:' +
          objWidth +
          "px; height:" +
          objHeight +
          'px;"></div>'
      );
      $("#" + imageId + "-container").append('<div class="imageZoom"></div>');
    }

    // create references to the modal...
    var modal = document.getElementById(modalId);
    // to all images
    var images = document.getElementById(imageId + "-container"); //PZ
    // the image in the modal
    var modalImage = document.getElementById(modalImg);
    // and the caption in the modal
    var captionText = $("#zoomCaption caption");

    // Go through all of the images with our custom class

    if (typeof obj.properties.dragAndDrop !== typeof undefined) {
      var myObj = $("#" + imageId); // <-- added the object in myObj for easier reference.
      dragDropSetup(myObj, obj.properties.dragAndDrop);
    }
    //Print this in the previewer consoler.
    cPrint("system", "component", "This is an image component");
    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);
  };
})(this);
