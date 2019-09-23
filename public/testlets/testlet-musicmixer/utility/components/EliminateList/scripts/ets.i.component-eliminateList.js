(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create eliminate list Component******************/
  object.ETS.i.component.eliminatelist = function(obj) {
    console.log("Create eliminatelist component...");
    console.log(obj);

    //Create the Eliminate List component
    //All the properties have been declared dynamically, they will be coming from the JSON file.
    var options = idMapContent(obj.properties.options);
    var scoreId = idMapContent(obj.identity.scoreID);
    var responseId = idMapContent(obj.identity.responseId);
    var listName = idMapContent(obj.identity.name);
    var eliminatelistId = obj.identity.id + "-txt";

    //Build the Eliminate List
    var str = "";

    str +=
      '<div aria-label="eliminatelist" name="' +
      listName +
      '" id="' +
      eliminatelistId +
      '" class="' +
      obj.properties.class +
      '" tabindex="' +
      obj.properties.tabindex +
      '">';

    str += "<table>";

    //Get all the values from param.json
    $(options).each(function(index) {
      /*if (obj.state) {
                for (var i = 0; i < obj.state.length; i += 1) {
                    if (obj.state[i].index === index) {
                        this.selected = true;
                        console.log(this);
                    }
                }
            }*/
      str += "<tr>";
      str += '<td class="container">';
      //Check for "tabindex" property
      if (obj.properties.tabindex == "1") {
        str +=
          '<div role="checkbox" aria-checked="' +
          this.selected +
          '" tabindex = "0" value="' +
          this.value +
          '" class="option" selected="' +
          this.selected +
          '"   onkeydown="toggleEliminateList(event, \'' +
          this.value +
          "')\" onclick=\"toggleEliminateList(event, '" +
          this.value +
          '\')"  onfocus="focusCheckbox(event)" onblur="blurCheckbox(event)">' +
          this.label +
          "</div>";
      } else if (obj.properties.tabindex == "-1") {
        str +=
          '<div role="checkbox" aria-checked="' +
          this.selected +
          '" tabindex = "-1" value="' +
          this.value +
          '" class="option" selected="' +
          this.selected +
          '" onkeydown="toggleEliminateList(event, \'' +
          this.value +
          "')\" onclick=\"toggleEliminateList(event, '" +
          this.value +
          '\')"  onfocus="focusCheckbox(event)" onblur="blurCheckbox(event)">' +
          this.label +
          "</div>";
      } else {
        str +=
          '<div role="checkbox" aria-checked="' +
          this.selected +
          '" tabindex = "0" value="' +
          this.value +
          '" class="option" selected="' +
          this.selected +
          '"  onkeydown="toggleEliminateList(event, \'' +
          this.value +
          "')\" onclick=\"toggleEliminateList(event, '" +
          this.value +
          '\')"  onfocus="focusCheckbox(event)" onblur="blurCheckbox(event)">' +
          this.label +
          "</div>";
      }
      str += "</td>";
      str += "</tr>";
    });

    str += "</table>";
    str += "</div>";

    $("#" + obj.identity.id).html(str);

    //Check if enabled is true/false
    if (obj.properties.enabled == "false") {
      $("#" + eliminatelistId).addClass("disabled");
    } else if (obj.properties.enabled == "true") {
      $("#" + eliminatelistId).removeClass("disabled");
    }

    //Save response for the captured selected options
    var listGroup = document.querySelectorAll('[role="checkbox"]');
    eliminateArray = [];
    $("#" + eliminatelistId).onload = preLoad();
    $(listGroup).bind("click keydown", function(event) {
      if (event.keyCode == "32" || event.type == "click") {
        if (obj.required) {
          if (eliminateArray.length >= obj.properties.minSelect) {
            apiTestlet.removeRequired(obj.identity.responseId);
          } else {
            apiTestlet.addRequired(obj.identity.responseId);
          }
          //Check for "maxSelect" property
          if (eliminateArray.length > obj.properties.maxSelect) {
            toggleEliminateList(event, $(this).label);
            return false;
          } else {
            console.log(eliminateArray);
            //save response
            apiTestlet.saveResponse(scoreId, responseId, eliminateArray);
            //save state
            var state = eliminateArray;
            obj.state = state;
            apiTestlet.saveState(responseId, eliminateArray);
            //save console.log()
            apiTestlet.saveLog(responseId, eliminateArray);
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
            toggleEliminateListNodeValue($("#" + eliminatelistId + " .option")[index], options[index].value, "false");
          }
        });
        if (obj.required) {
          apiTestlet.removeRequired(obj.identity.responseId);
        }
      }
    }
  };
})(this);
