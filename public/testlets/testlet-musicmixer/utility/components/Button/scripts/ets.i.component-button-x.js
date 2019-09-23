(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Button Component******************/

  object.ETS.i.component.button = function(obj) {
    console.log("Create Button...");
    console.log(obj);

    //Create the Button component
    //All the properties have been declared dynamically, they will be coming from the JSON file.
    var label = idMapContent(obj.properties.label);
    var name = idMapContent(obj.identity.name);
    var responseId = idMapContent(obj.identity.responseId);
    var scoreId = idMapContent(obj.identity.scoreID);
    var buttonType = idMapContent(obj.properties.type);

    var buttonId = obj.identity.id + "-button";

    //Add necessary parenthesis to pass as variables
    var onevent = obj.properties.onclick;
    if (onevent) {
      var onevent_search = onevent.search(":");
      var onevent_length = onevent.length;
      if (onevent_search != -1) {
        //Pass Multiple Functions
        onevent = 'stringify("' + onevent + '")';
        console.log(onevent);
        console.log("This is multiple functions");
      } else {
        //Pass single functions
        var res = onevent.replace("(", '("');
        var res2 = res.replace(",", '","');
        var res3 = res2.replace(")", '")');
        onevent = res3;
        console.log("This is single function");
      }
    }

    //console.log(onevent);
    var str =
      '<div data-type="button" role="button" id="' +
      buttonId +
      '"' +
      " onclick=" +
      onevent +
      " " +
      '"name="' +
      obj.identity.name +
      '" aria-label="button" tabindex="' +
      obj.properties.tabindex +
      '" aria-pressed="false" class="' +
      obj.properties.class +
      '"><div></div><span>' +
      label +
      "</span></div>";

    console.log(str);

    $("#" + obj.identity.id).html(str);
    //If button has type inline add the inline class
    if (buttonType === "inline") {
      $("#" + buttonId).addClass("inline");
    }

    $("#" + buttonId).bind("mouseup keydown", function(event) {
      if (
        event.which == "13" ||
        event.keycode == "13" ||
        event.which == "32" ||
        event.keycode == "32" ||
        event.type == "mouseup"
      ) {
        console.log("pressed");
        $("#" + buttonId).attr("aria-pressed", "true");
        var buttonResponse = "clicked";
        if (obj.required) {
          if (buttonResponse != "") {
            apiTestlet.removeRequired(obj.identity.responseId);
          } else {
            apiTestlet.addRequired(obj.identity.responseId);
          }
        }
        //save response
        apiTestlet.saveResponse(scoreId, responseId, buttonResponse);
        //save state
        var state = buttonResponse;
        apiTestlet.saveState(responseId, state);
        //save console.log()
        apiTestlet.saveLog(responseId, state);
      }
    });

    //Check if enabled is true/false
    if (obj.properties.enabled == "true") {
      $("#" + buttonId).removeClass("disabled");
      $("#" + buttonId).attr("aria-disabled", false);
    } else if (obj.properties.enabled == "false") {
      $("#" + buttonId).addClass("disabled");
      $("#" + buttonId).attr("aria-disabled", true);
    }

    //Print this in the previewer consoler.
    cPrint("system", "component", "This is a Button component");

    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);
  };
})(this);
