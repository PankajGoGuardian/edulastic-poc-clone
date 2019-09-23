(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Text-field Component******************/

  object.ETS.i.component.textfield = function(obj) {
    console.log("create textfield...");

    var label = idMapContent(obj.properties.label);
    var placeholder = idMapContent(obj.properties.placeholder);
    var maxLength = idMapContent(obj.properties.maxLength);
    var minLength = idMapContent(obj.properties.minLength);
    var size = idMapContent(obj.properties.size);
    var scoreId = idMapContent(obj.identity.scoreID);
    var txtresponseId = idMapContent(obj.identity.responseId);
    var textfieldName = idMapContent(obj.identity.name);

    var textfieldId = obj.identity.id + "-txt";
    var onevent = obj.properties.onkeydown;

    //Create the Textfield component
    //All the properties have been declared dynamically and it will be loaded through the JSON file.
    var str = "";
    if (label !== "" && label !== null) {
      str += "<label>" + label + "</label>";
    }
    str +=
      '<input type="text" role="textbox" id="' +
      textfieldId +
      '" data-name="' +
      textfieldName +
      '" onkeydown="' +
      onevent +
      "" +
      '" onclick="' +
      onevent +
      "" +
      '" pattern="' +
      obj.properties.regEx +
      '" aria-label="Textfield" autocomplete="off" tabindex="' +
      obj.properties.tabindex +
      '" placeholder="' +
      placeholder +
      '" class="' +
      obj.properties.class +
      '" maxlength="' +
      maxLength +
      '" size="' +
      size +
      '" >';

    $("#" + obj.identity.id).html(str);

    var responseId = txtresponseId; // || obj.identity.id + "_txt";

    //Check if enabled is true/false
    if (obj.properties.enabled === "true") {
      $("#" + textfieldId).attr("disabled", false);
    } else if (obj.properties.enabled === "false") {
      $("#" + textfieldId).attr("disabled", true);
    }

    $("#" + obj.identity.id + " input").keydown(function(event) {
      //Check if the input has reached the maximum limit
      if (this.value.length >= maxLength) {
        var charCode = event.which ? event.which : event.keyCode;
        if ((charCode < 37 || charCode > 40) && charCode !== 8) {
          console.log("You have exceeded the maximum number of digits.");
        }
      }

      //Restric user from typing other than asked inputs
      //            textFieldInput(event);
    });

    //Added this to check the regex and stop users to type the invalid characters
    $("#" + obj.identity.id).bind("keypress", function(event) {
      if (obj.properties.regEx !== "") {
        var regex = new RegExp(obj.properties.regEx);
        var key = String.fromCharCode(event.which);

        if (!regex.test(key)) {
          event.preventDefault();
          return false;
        }
      }
    });

    //Once we have the actual APIs, will update this function.
    $("#" + obj.identity.id + " input").keyup(function(event) {
      //Check for regular expression if it is available
      var regExValue = true;
      if (obj.properties.regEx !== "") {
        var checkRegEx = new RegExp(obj.properties.regEx);
        if (checkRegEx.test(this.value)) {
          regExValue = true;
        } else {
          regExValue = false;
        }
      }

      //Donot Log Response if RegEx fails
      if (regExValue) {
        //Next button Enable/Disable
        if (obj.required) {
          if (this.value !== "") {
            apiTestlet.removeRequired(obj.identity.responseId);
          } else {
            apiTestlet.addRequired(obj.identity.responseId);
          }
        }

        var fieldValue = this.value;

        //test if the response is a number, and if so, render it as the equivalent number
        if (!isNaN(this.value)) {
          if (this.value.length === 0) {
            fieldValue = "";
          } else {
            fieldValue = String(Number(this.value));
          }
        }

        var tfResponse = fieldValue;

        //Check if there is a pattern
        if (fieldValue.length > 0) {
          if (typeof obj.properties.responsePattern !== typeof undefined) {
            if (obj.properties.responsePattern !== "") {
              var pattern = obj.properties.responsePattern.split("{response}");

              tfResponse = pattern.join(fieldValue);
            }

            //Check if any calculations [calc] are required
            if (tfResponse.split("[calc]").length > 1) {
              var calcArr = tfResponse.split("[calc]");
              calcArr[1] = eval(tfResponse.split("[calc]")[1]);
              tfResponse = calcArr.join("");
            }
          }
        }

        //save response
        apiTestlet.saveResponse(scoreId, responseId, tfResponse);

        //save state
        var state = tfResponse;
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
        var myRestoreData = String(obj.state);

        //If there is a pattern on this object, restore it accordingly
        if (typeof obj.properties.responsePattern !== typeof undefined) {
          if (obj.properties.responsePattern !== "") {
            var patternParts = obj.properties.responsePattern.split("{response}");

            myRestoreData = myRestoreData.replace(patternParts[0], "");
            if (patternParts.length > 1) {
              myRestoreData = myRestoreData.replace(patternParts[1], "");
            }

            //Is there a calculation in this pattern?

            if (obj.properties.responsePattern.split("[calc]").length > 1) {
              var calcParts = obj.properties.responsePattern.split("[calc]");
              var myPatternInsideCalc = calcParts[1];

              //Prep the obj.state for replacement use
              var stateParts = String(obj.state);
              stateParts = stateParts.replace(calcParts[0], "");
              stateParts = stateParts.replace(calcParts[2], "");

              //making sure the state doesn't contain a -

              /*
                            if (eval(stateParts) < 0) {
                                if (String(stateParts).indexOf('.') !== -1) {
                                    stateParts = -1 * stateParts;
                                }
                            }
                            */

              myPatternInsideCalc = myPatternInsideCalc.replace("{response}", stateParts);

              myPattern = String(myPatternInsideCalc);

              console.log(">>>>>>>>> RESTORING DATA 1:", myPattern);

              //replace basic operators
              //+ to -
              if (myPattern.indexOf("+") > -1) {
                myPattern = myPattern.replace("+", "-");
              } else if (myPattern.indexOf("-") > 0) {
                // / to *
                myPattern = myPattern.replace("-", "+");
              } else if (myPattern.indexOf("/") > -1) {
                // / to *
                myPattern = myPattern.replace("/", "*");
              } else if (myPattern.indexOf("*") > -1) {
                // * to /
                myPattern = myPattern.replace("*", "/");
              }

              console.log(">>>>>>>>> RESTORING DATA 2:", myPattern);

              myRestoreData = eval(myPattern);
            }
          }
        }

        $("#" + obj.identity.id + " input").val(myRestoreData);
        if (obj.required) {
          apiTestlet.removeRequired(obj.identity.responseId);
        }
      }
    }
  };
})(this);
