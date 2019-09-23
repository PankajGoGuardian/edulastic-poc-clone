(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Checkbox Component******************/
  object.ETS.i.component.checkbox = function(obj) {
    console.log("Create Check box component...");
    console.log(obj);

    //Create the Check box component
    //All the properties have been declared dynamically, they will be coming from the JSON file.
    var options = idMapContent(obj.properties.options);

    var responseId = idMapContent(obj.identity.responseId);
    var scoreId = idMapContent(obj.identity.scoreID);

    var checkboxId = obj.identity.id + "-txt";

    //Build the check box
    var str = "";

    str +=
      '<div aria-label="checkbox" id="' +
      checkboxId +
      '" class="' +
      obj.properties.class +
      '" tabindex="' +
      obj.properties.tabindex +
      '">';

    str += '<table class="ets-selectList">';

    //Get all the values from param.json
    $(options).each(function(index) {
      if (obj.state) {
        for (var i = 0; i < obj.state.length; i += 1) {
          if (obj.state[i].index === index) {
            this.selected = true;
          }
        }
      }
      str += "<tr>";
      str += '<td class="container">';
      if (obj.properties.tabindex == "1") {
        str +=
          '<div role="checkbox" aria-checked="' +
          this.selected +
          '" tabindex = "0" value="' +
          this.value +
          '" class="option" selected="' +
          this.selected +
          '" onkeydown="toggleCheckbox(event, \'' +
          this.value +
          "')\" onclick=\"toggleCheckbox(event, '" +
          this.value +
          '\')"  onfocus="focusCheckbox(event)" onblur="blurCheckbox(event)">';
      } else if (obj.properties.tabindex == "-1") {
        str +=
          '<div role="checkbox" aria-checked="' +
          this.selected +
          '" tabindex = "-1" value="' +
          this.value +
          '" class="option" selected="' +
          this.selected +
          '" onkeydown="toggleCheckbox(event, \'' +
          this.value +
          "', " +
          index +
          ')" onclick="toggleCheckbox(event, \'' +
          this.value +
          "', " +
          index +
          ')"  onfocus="focusCheckbox(event)" onblur="blurCheckbox(event)">';
      } else {
        str +=
          '<div role="checkbox" aria-checked="' +
          this.selected +
          '" tabindex = "0" value="' +
          this.value +
          '" class="option" selected="' +
          this.selected +
          '" onkeydown="toggleCheckbox(event, \'' +
          this.value +
          "', " +
          index +
          ')" onclick="toggleCheckbox(event, \'' +
          this.value +
          "', " +
          index +
          ')"  onfocus="focusCheckbox(event)" onblur="blurCheckbox(event)">';
      }
      str += '<div class="prefix">';
      //Making sure this span is only placed when the optionLabel is actually assigned.
      if (this.optionLabel !== "" && this.optionLabel !== null) {
        str += "<span>" + this.optionLabel + "</span>";
      }
      str += '<span class="select"></span>';
      str += "</div>";
      str += '<div class="label">' + this.label + "</div>";
      str += '<div class="postfix"></div>';
      str += "</div>";
      str += "</td>";
      str += "</tr>";
    });

    str += "</table>";
    str += "</div>";

    $("#" + obj.identity.id).html(str);

    //Check if enabled is true/false
    if (obj.properties.enabled == "false") {
      $("#" + checkboxId).addClass("disabled");
    } else if (obj.properties.enabled == "true") {
      $("#" + checkboxId).removeClass("disabled");
    }

    //Save response for the captured selected options
    var checkboxGroup = document.querySelectorAll('[role="checkbox"]');
    arr = [];
    $("#" + checkboxId).onload = loadRes();
    $(checkboxGroup).bind("click keydown", function(event) {
      if (event.keyCode == "32" || event.type == "click") {
        if (obj.required) {
          if (arr.length >= obj.properties.minSelect) {
            apiTestlet.removeRequired(obj.identity.responseId);
          } else {
            apiTestlet.addRequired(obj.identity.responseId);
          }
          if (arr.length > obj.properties.maxSelect) {
            toggleCheckbox(event, $(this).value);
            return false;
          } else {
            console.log(arr);
            //save response
            apiTestlet.saveResponse(scoreId, responseId, arr);
            //save state
            var state = arr;
            obj.state = state;
            apiTestlet.saveState(responseId, arr);
            //save console.log()
            apiTestlet.saveLog(responseId, arr);
          }
        }
      }
    });

    //Restore state function
    restore();

    function restore() {
      if (typeof obj.state !== "undefined") {
        $(options).each(function(index) {
          if (obj.state.indexOf(options[index].value) > -1) {
            toggleCheckboxOption($("#" + checkboxId + " .option")[index], options[index].value, "false");
          }
        });
        if (obj.required) {
          apiTestlet.removeRequired(obj.identity.responseId);
        }
      }
    }
  };
})(this);
