(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Dropdown Component Component******************/
  object.ETS.i.component.dropdown = function(obj) {
    console.log("Create Dropdown...");
    console.log(obj);

    //Create the Listbox component
    //All the properties have been declared dynamically, they will be coming from the JSON file.
    var placeholder = idMapContent(obj.properties.placeholder);
    var options = idMapContent(obj.properties.options);
    var scoreId = idMapContent(obj.identity.scoreID);
    var dropdownResponse = idMapContent(obj.identity.responseId);
    var dropdownName = idMapContent(obj.identity.name);

    var dropdownId = obj.identity.id + "-txt";
    var dropdownList = obj.identity.id + "-list";

    //Figure out what the longest response is - PZ
    $(options).each(function(index) {
      console.log(this.label);
    });

    //Initialize the Dropdown

    //First, add the container - PZ
    $("#" + obj.identity.id).html('<div id="' + dropdownId + '-container" class="' + obj.properties.class + '"></div>');
    var myDropdown = $("#" + dropdownId + "-container");

    //Then, generate the elements within - PZ
    $(myDropdown).append(
      '<div name="' +
        dropdownName +
        '" id="' +
        dropdownId +
        '" tabindex="' +
        obj.properties.tabindex +
        '" aria-haspopup="listbox" class="selectTrigger"><div></div><span>' +
        placeholder +
        "<span></div>"
    );
    $(myDropdown).append(
      '<ul id="' +
        dropdownList +
        '" role="listbox" tabindex="-1" aria-labelledby="' +
        dropdownId +
        '" class="hidden"></ul>'
    );

    var myOptionList = $("#" + dropdownList);

    //First add the non element
    $(myOptionList).append('<li role="option" aria-selected="false"></li>');

    //While adding the LI options to the UL, check which is the longest - PZ
    var myMaxOptionVal = 0;

    //Get the font-size of the testlet at THIS moment - PZ
    $(myDropdown).prepend('<div id="fontSizePicker">' + placeholder + "</div>");

    var myFontSizePicker = $("#fontSizePicker");
    var dropWidth = 0;

    if ($(myFontSizePicker).width() > dropWidth) {
      dropWidth = $(myFontSizePicker).width();
    }

    console.log("ICL New Width:", $(myFontSizePicker).html(), $(myFontSizePicker).width());

    //get the M size
    $("#fontSizePicker").html("M");
    var myFontSize = Math.ceil($("#fontSizePicker").width());
    if ($(myFontSizePicker).width() > dropWidth) {
      dropWidth = $(myFontSizePicker).width();
    }

    $(options).each(function(index) {
      $(myOptionList).append(
        '<li id="' +
          dropdownId +
          "-option" +
          index +
          '" value="' +
          this.value +
          '" role="option">' +
          this.label +
          "</li>"
      );

      $(myFontSizePicker).html(this.label);

      if ($(myFontSizePicker).width() > dropWidth) {
        dropWidth = $(myFontSizePicker).width();
        console.log("DD Width - " + dropdownId + ":", dropWidth);
      }

      //Check the length of this option - PZ
      var thisOptionVal = this.label.length;

      if (thisOptionVal > myMaxOptionVal) {
        myMaxOptionVal = thisOptionVal;
      }
    });

    var mpl = String($("#fontSizePicker").css("padding-left"));
    mpl = Number(mpl.substr(0, mpl.length - 2));
    var mpr = String($("#fontSizePicker").css("padding-right"));
    mpr = Number(mpr.substr(0, mpr.length - 2));

    console.log("MP", mpl, mpr);
    console.log("FS", myFontSize);

    //var myFontSize = $('#fontSizePicker').width();
    //$('#fontSizePicker').remove();

    //Now set the value of the width - PZ
    //var dropWidth = Math.floor((myMaxOptionVal * .85) * myFontSize) + (4 * myFontSize);
    var ddBtnWidth = String(dropWidth + 2 * myFontSize + mpl + mpr) + "px";
    var ddBtnWidthPlus = String(dropWidth + 4 * myFontSize + mpl + mpr) + "px";
    var ddBtnWidthContainer = String(dropWidth + 5.5 * myFontSize + mpl + mpr) + "px";

    console.log(ddBtnWidth, ":", ddBtnWidthPlus);

    $("#" + dropdownId + "-container").css({
      width: ddBtnWidthContainer
    });

    console.log("Setting", dropdownId, ddBtnWidthPlus);

    $("#" + dropdownId).css({
      width: ddBtnWidthPlus
    });

    $("#" + dropdownId)
      .next()
      .css({
        width: ddBtnWidthPlus
      });

    //Also for the span
    $("#" + obj.identity.id).addClass("input-select-container");

    //Check if selected is true/false
    $(options).each(function(index) {
      if (this.selected === "true") {
        document.getElementById(dropdownId).innerHTML = this.label;
      }
    });

    //Remove the fontSizeContainer.
    $("#fontSizePicker").remove();

    //Response
    var responseId = dropdownResponse;
    var captureResponse = function(val) {
      if (obj.required) {
        if (val !== "" && val !== "false") {
          apiTestlet.removeRequired(obj.identity.responseId);
        } else {
          apiTestlet.addRequired(obj.identity.responseId);
        }
      }
      if (val === "false") {
        val = "";
      }
      //save response
      apiTestlet.saveResponse(scoreId, responseId, val);

      //Populate dropdownText
      var mySelectObj = $("#" + obj.identity.id)[0];
      var dropdownText = "";

      $(mySelectObj)
        .find("li")
        .each(function(index) {
          if ($(this).attr("value") === val) {
            dropdownText = $(this).html();
          }
        });

      //Filter any scripts from the dropdownText
      var ddTarr = dropdownText.split("<script");
      dropdownText = ddTarr[0];

      //save state
      var state = dropdownText;

      obj.state = state;

      apiTestlet.saveState(responseId, state);
      //save console.log()
      apiTestlet.saveLog(responseId, state);
    };

    //Check if enabled is true/false
    if (obj.properties.enabled === "true") {
      $("#" + dropdownId).removeClass("disabled");
    } else if (obj.properties.enabled === "false") {
      $("#" + dropdownId).addClass("disabled");
    }

    // restore state function, each component should have restore function
    restore();

    function restore() {
      if (typeof obj.state !== "undefined") {
        var isMML = false;

        if (obj.state.split("MathJax").length > 0) {
          isMML = true;
          obj.state = obj.state.split("<script")[0];
        }

        document.getElementById(dropdownId).innerHTML = obj.state;

        if (obj.required) {
          apiTestlet.removeRequired(obj.identity.responseId);
        }
      }
    }

    //Declaring the values to support collasible dropdown library
    var button = document.getElementById(dropdownId);
    //References declared from ets.colaapsible.js
    var exListbox = new ETS.Listbox(document.getElementById(dropdownList));
    var listboxButton = new ETS.ListboxButton(button, exListbox, captureResponse);
  };
})(this);
