(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Placeholder Component******************/

  object.ETS.i.component.placeholder = function(obj) {
    console.log("create placeholder...");
    console.log(obj);

    var placeholderName = idMapContent(obj.identity.name);
    var responseId = idMapContent(obj.identity.responseId);
    var scoreId = idMapContent(obj.identity.scoreID);

    var placeholderId = obj.identity.id + "-txt";

    //Create the placeholder component
    //All the properties have been declared dynamically and it will be loaded through the JSON file.
    var str = '<span class="' + obj.properties.class + '" id="' + placeholderId + '"></span>';

    $("#" + obj.identity.id).html(str);

    //Set the height and width for the placeholder
    var objWidth = idMapContent(obj.properties.width);
    var objHeight = idMapContent(obj.properties.height);

    $("#" + placeholderId).css("width", objWidth + "px");
    $("#" + placeholderId).css("height", objHeight + "px");

    //To execute drag and drop
    if (typeof obj.properties.dragAndDrop !== typeof undefined) {
      var myObj = $("#" + placeholderId);
      dragDropSetup(myObj, obj);
    }

    //Print this in the previewer consoler.
    cPrint("system", "component", "This is a placeholder component");
    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);
  };
})(this);
