(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Text Component******************/

  object.ETS.i.component.text = function(obj) {
    console.log("Create Text...");
    console.log(obj);

    //Create the Text component
    //All the properties have been declared dynamically, they will be coming from the JSON file.
    var label = idMapContent(obj.properties.label);
    var value = idMapContent(obj.properties.value);
    var name = idMapContent(obj.identity.name);
    var responseId = idMapContent(obj.identity.responseId);

    var textId = obj.identity.id + "-text";

    var str = "";

    str +=
      '<div class="' +
      obj.properties.class +
      '" id="' +
      textId +
      '" data-value="' +
      value +
      '" data-name="' +
      name +
      '" tabindex="' +
      obj.properties.tabindex +
      '">' +
      label +
      "</div>";

    $("#" + obj.identity.id).html(str);

    if (typeof obj.properties.dragAndDrop !== typeof undefined) {
      var myObj = $("#" + textId);
      dragDropSetup(myObj, obj);
    }

    //Print this in the previewer consoler.
    cPrint("system", "component", "This is a Text component");

    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);
  };
})(this);
