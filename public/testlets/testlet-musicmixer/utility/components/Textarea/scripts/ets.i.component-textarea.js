(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Text-area Component******************/

  object.ETS.i.component.textarea = function(obj) {
    console.log("Create Textarea...");
    console.log(obj);

    //Create the Textarea component
    //All the properties have been declared dynamically, they will be coming from the JSON file.

    var label = idMapContent(obj.properties.label);
    var placeholder = idMapContent(obj.properties.placeholder);
    var responseId = idMapContent(obj.identity.responseId);
    var scoreId = idMapContent(obj.identity.scoreID);
    var textareaName = idMapContent(obj.identity.name);
    var textareaRow = idMapContent(obj.properties.rows);
    var textareaColumn = idMapContent(obj.properties.cols);
    var textareaMinlength = idMapContent(obj.properties.minLength);

    var textareaId = obj.identity.id + "-txt";

    var str =
      "<label>" +
      label +
      '</label> <textarea role="textarea" id="' +
      textareaId +
      '" class="' +
      obj.properties.class +
      '" tabindex="' +
      obj.properties.tabindex +
      '" data-name="' +
      textareaName +
      '" aria-label="Textarea" rows="' +
      textareaRow +
      '" cols="' +
      textareaColumn +
      '" placeholder = "' +
      placeholder +
      '"  minlength="' +
      textareaMinlength +
      '"></textarea>';

    $("#" + obj.identity.id).html(str);

    //Resize the textarea
    var myFixedClass = "";
    if (obj.properties.fixed == "true") {
      myFixedClass = "fixed";
      $("#" + textareaId).addClass(myFixedClass);
    }

    //Set the width as per columns
    var colsWidth = obj.properties.cols;
    $("#" + textareaId).css("width", colsWidth + "ch");

    //Set the maxlength
    $("#" + textareaId).on("input", function(evt) {
      textAreaMaxLength(this);
    });

    var maxLength = idMapContent(obj.properties.maxLength);

    textAreaMaxLength = function(elm) {
      if (elm.value.length >= maxLength) {
        elm.value = elm.value.substr(0, maxLength);
      }
    };

    var itemId = responseId;

    //Check if the enabled property is true/false
    if (obj.properties.enabled == "true") {
      $("#" + textareaId).attr("disabled", false);
    } else if (obj.properties.enabled == "false") {
      $("#" + textareaId).attr("disabled", true);
    }

    $("#" + textareaId).on("keypress", function(event) {
      if ((event.which === 32 || event.which === 13) && !this.value.length) event.preventDefault();
    });

    //Save Response function
    $("#" + textareaId).keyup(function() {
      if (obj.required) {
        if (this.value !== "") {
          apiTestlet.removeRequired(obj.identity.responseId);
        } else {
          apiTestlet.addRequired(obj.identity.responseId);
        }
        //save response
        apiTestlet.saveResponse(scoreId, responseId, this.value);
        //save state
        var state = this.value;
        obj.state = state;
        apiTestlet.saveState(responseId, state);
        //save console.log()
        apiTestlet.saveLog(responseId, state);
      }
    });

    //Restore function
    restore();

    function restore() {
      if (typeof obj.state !== "undefined") {
        $("#" + textareaId).val(obj.state);
        if (obj.required) {
          apiTestlet.removeRequired(responseId);
        }
      }
    }
  };
})(this);
