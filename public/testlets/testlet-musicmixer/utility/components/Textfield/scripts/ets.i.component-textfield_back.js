(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Text-field Component******************/

  object.ETS.i.component.textfield = function(obj) {
    console.log("create textfield...");

    var label = idMapContent(obj.properties.label);
    var placeholder = idMapContent(obj.properties.placeholder);
    var txtresponseId = idMapContent(obj.identity.responseId);
    var textfieldName = idMapContent(obj.identity.name);

    var textfieldId = obj.identity.id + "-txt";

    //Create the Textfield component
    //All the properties have been declared dynamically and it will be loaded through the JSON file.
    var str =
      "<label>" +
      label +
      ' </label><input type="text" role="textbox" id="' +
      textfieldId +
      '" data-name="' +
      textfieldName +
      '" aria-label="Textfield" placeholder = "' +
      placeholder +
      '" class="' +
      obj.properties.class +
      '" maxlength="' +
      obj.properties.maxLength +
      '">';

    $("#" + obj.identity.id).html(str);

    let responseId = txtresponseId; // || obj.identity.id + "_txt";

    //Check if enabled is true/false
    if (obj.properties.enabled == true) {
      $("#" + textfieldId).attr("disabled", false);
    } else if (obj.properties.enabled == false) {
      $("#" + textfieldId).attr("disabled", true);
    }

    //Once we have the actual APIs, will update this function.
    $("#" + obj.identity.id + " input").keyup(function() {
      if (obj.required) {
        if (this.value !== "") {
          apiTestlet.removeRequired(obj.identity.responseId);
        } else {
          apiTestlet.addRequired(obj.identity.responseId);
        }

        //save response
        apiTestlet.saveResponse(responseId, this.value);

        //save state
        var state = this.value;
        apiTestlet.saveState(responseId, state);
        obj.state = state;

        //save console.log()
        apiTestlet.saveLog(responseId, state);
      }
    });

    // restore state function, each component should have restore function
    restore();

    function restore() {
      if (typeof obj.state !== "undefined") {
        $("#" + obj.identity.id + " input").val(obj.state);
        if (obj.required) {
          apiTestlet.removeRequired(obj.identity.responseId);
        }
      }
    }
  };
})(this);
