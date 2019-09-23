(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Inline Passage Selection Component******************/

  object.ETS.i.component.passageSelection = function(obj) {
    console.log("Create Inline Passage Selection...");
    console.log(obj);

    //Create the Text component
    //All the properties have been declared dynamically, they will be coming from the JSON file.
    var label = idMapContent(obj.properties.label);
    var value = idMapContent(obj.properties.value);
    var options = idMapContent(obj.properties.options);
    var name = idMapContent(obj.identity.name);
    var scoreId = idMapContent(obj.identity.scoreID);
    var responseId = idMapContent(obj.identity.responseId);

    var textId = obj.identity.id + "-text";

    var str = "";

    str +=
      '<div class="' +
      obj.properties.class +
      '" data-value="' +
      value +
      '" data-name="' +
      name +
      '" tabindex="' +
      obj.properties.tabindex +
      '">';
    str += '<p class="content">';
    var i = 0;
    $(options).each(function(index) {
      /*if (obj.state) {
    for (var i = 0; i < obj.state.length; i += 1) {
        if (obj.state[i].index === index) {
            this.selected = true;
            console.log(this);
        }
    }
}*/
      str +=
        '<span id="passage' +
        i +
        '" aria-label="passageSelection" class="passageSelection" value="' +
        this.value +
        '" data-selectable="' +
        this.selectable +
        '" tabindex="' +
        obj.properties.tabindex +
        '" index="' +
        index +
        '" aria-checked="false">' +
        this.label +
        "</span>";
      i++;
    });
    str += "</p>";
    str += "</div>";

    $("#" + obj.identity.id).html(str);

    var answerText = "",
      answer = "",
      answerArray = [];

    //Check if the sentence has selection true

    $(".passageSelection").bind("click keydown", function(event) {
      if (
        event.type == "click" ||
        event.keycode == "13" ||
        event.keycode == "32" ||
        event.which == "32" ||
        event.which == "13"
      ) {
        if ($(this).attr("data-selectable") == "true") {
          answerText = this.attributes[3].nodeValue;
          //Select/deselect the opions from inline passage selection
          if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $(this).attr("aria-checked", "false");
            answerArray.splice(answerArray.indexOf(answerText), 1);
          } else {
            $(this).addClass("selected");
            $(this).attr("aria-checked", "true");
            answerArray.push(answerText);
          }
          console.log($(this).index());
          console.log(answerArray);
          //To restrict the selection
          if (answerArray.length > obj.properties.maxSelect) {
            if ($(this).hasClass("selected")) {
              $(this).removeClass("selected");
              $(this).attr("aria-checked", "false");
              answerArray.splice(answerArray.indexOf(answerText), 1);
            } else {
              $(this).addClass("selected");
              $(this).attr("aria-checked", "true");
              answerArray.push(answerText);
            }
            return false;
          }

          //Check if the response is required
          if (obj.required) {
            if (answerArray.length >= obj.properties.minSelect) {
              apiTestlet.removeRequired(obj.identity.responseId);
            } else {
              apiTestlet.addRequired(obj.identity.responseId);
            }
          }
          //save response
          apiTestlet.saveResponse(scoreId, responseId, answerArray);
          //save state
          var state = answerArray;
          obj.state = state;
          console.log(obj.state);
          apiTestlet.saveState(responseId, answerArray);
          //save console.log()
          apiTestlet.saveLog(responseId, answerArray);
        } else {
        }
      }
    });

    //Restore state function
    restore();

    function restore() {
      if (typeof obj.state !== "undefined") {
        if (obj.required) {
          apiTestlet.removeRequired(obj.identity.responseId);
        }
      }
    }

    //Print this in the previewer consoler.
    cPrint("system", "component", "This is an Inline Passage Selection component");

    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);
  };
})(this);
