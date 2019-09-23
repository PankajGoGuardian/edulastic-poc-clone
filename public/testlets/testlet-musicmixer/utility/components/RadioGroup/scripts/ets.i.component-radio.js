(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Button Component******************/
  object.ETS.i.component.radio = function(obj) {
    console.log("Create Radio buttons...");
    console.log(obj);

    //Create the Radio Button component
    //All the properties have been declared dynamically, they will be coming from the JSON file.
    var options = idMapContent(obj.properties.options);
    var scoreId = idMapContent(obj.identity.scoreID);
    var responseId = idMapContent(obj.identity.responseId);
    var name = idMapContent(obj.identity.responseId);
    var radioId = obj.identity.id + "-txt";

    //Build the radio buttons
    var str = "";

    str +=
      '<div role="radiogroup" aria-label="radiogroup" id="' +
      radioId +
      '" class="' +
      obj.properties.class +
      '" name="' +
      name +
      '" tabindex="' +
      obj.properties.tabindex +
      '">';

    str += '<table class="ets-selectList">';

    $(options).each(function(index) {
      str += "<tr>";
      str += '<td class="container">';
      var i = 0;
      str +=
        '<div role="radio" aria-checked="' +
        this.selected +
        '" tabindex="0" id="' +
        i +
        '" value="' +
        this.value +
        '" class="option" selected="' +
        this.selected +
        '" index="' +
        index +
        '">';
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

    //itemId will capture the responses
    let itemId = responseId;

    var captureResponse, getIndex; //Global variable to get the selected option value from radio group

    //Check if the option has been selected or not
    $(".option").bind("click keydown", function(event) {
      if (
        event.type == "click" ||
        event.keycode == "13" ||
        event.keycode == "32" ||
        event.which == "13" ||
        event.which == "32"
      ) {
        $(".option").removeClass("optionSelected");
        $(this).addClass("optionSelected");
        //Get the index value
        //                getIndex = this.attributes.index.value;
        //Get the response
        captureResponse = this.attributes[4].nodeValue;

        /*var responseString = ({
                    index: getIndex,
                    answer: captureResponse
                });*/

        //Check if the response is required
        if (obj.required) {
          if (captureResponse !== "") {
            apiTestlet.removeRequired(obj.identity.responseId);
          } else {
            apiTestlet.addRequired(obj.identity.responseId);
          }
        }
        console.log(captureResponse);
        //save response
        apiTestlet.saveResponse(scoreId, responseId, captureResponse);
        //save state
        var state = captureResponse;
        obj.state = state;
        apiTestlet.saveState(responseId, captureResponse);
        //save Log
        apiTestlet.saveLog(responseId, captureResponse);
      }

      // dispatch event on change
      window.dispatchEvent(
        new CustomEvent("itemChange", {
          detail: {
            target: this
          }
        })
      );
    });

    //Check if enabled is true or false
    if (obj.properties.enabled == "false") {
      $("#" + radioId).addClass("disabled");
    } else if (obj.properties.enabled == "true") {
      $("#" + radioId).removeClass("disabled");
    }

    //Initialize the functions for accessibility and aria support
    var rg1 = new ETS_RadioGroup(document.getElementById(radioId));
    rg1.init();
    //Restore function to save the state
    restore.call(rg1);
    function restore() {
      if (typeof obj.state !== "undefined") {
        var options = idMapContent(obj.properties.options);
        var self = this;
        $(options).each(function(index) {
          if (options[index].value === obj.state) {
            $($(".option")[index]).addClass("optionSelected");
            self.setChecked(self.radioButtons[index]);
          }
        });

        if (obj.required) {
          apiTestlet.removeRequired(obj.identity.responseId);
        }
      }
    }

    //Print some values to the consoler
    cPrint("system", "component", "This is a Radio button component");
    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);

    //Check if selected is true(load the option as preselected)
    /*$(options).each(function (index) {
    var rbc = options.filter(function (obj) {
        return obj.selected == "true";
    });
    var selection = rbc[rbc.length - 1];
    $("#" + selection.value).addClass('optionSelected');
});*/
  };
})(this);
