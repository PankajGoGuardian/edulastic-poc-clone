(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Response grid Component******************/
  object.ETS.i.component.responseGrid = function(obj) {
    console.log("Create Response grid...");
    console.log(obj);

    //Create the Response grid component
    //All the properties have been declared dynamically, they will be coming from the JSON file.
    var columns = idMapContent(obj.properties.columns);
    var rows = idMapContent(obj.properties.rows);
    var responseId = idMapContent(obj.identity.responseId);
    var scoreId = idMapContent(obj.identity.scoreID);
    var name = idMapContent(obj.identity.responseId);
    var type = idMapContent(obj.properties.type);
    var responseGridId = obj.identity.id + "-txt";

    radioTabIndex = obj.properties.tabindex;

    //Build the radio buttons
    var str = "";

    str += '<div id="' + responseGridId + '" name="' + name + '" tabindex="' + obj.properties.tabindex + '">';

    str += '<table class="winsight-responsegrid" data-componentType="' + type + '" id="tableId">';
    str += "<thead>";
    str += "<tr>";

    $(columns).each(function(index) {
      str += '<th value="' + this.value + '">' + this.label + "</th>";
    });
    str += "</tr>";
    str += "</thead>";
    str += "<tbody>";

    if (type == "single") {
      var i = 0;
      $(rows).each(function(index) {
        str += '<tr role="radiogroup" aria-label="radiogroup" id="' + i + '">';
        i++;
        str += '<td value="' + this.value + '">' + this.label + "</td>";
        $(columns).each(function(index) {
          if (index > 0) {
            str += '<td class="option"><div role="radio" aria-checked="' + this.selected + '" tabindex="0"></div></td>';
          }
        });
        str += "</tr>";
      });
    } else if (type == "multi") {
      $(rows).each(function(index) {
        str += '<tr aria-label="checkbox">';
        str += '<td value="' + this.value + '">' + this.label + "</td>";
        $(columns).each(function(index) {
          if (index > 0) {
            str +=
              '<td class="option"><div role="checkbox" aria-checked="' +
              this.selected +
              '" tabindex = "0" value="' +
              this.value +
              '" class="option" selected="' +
              this.selected +
              '" onkeydown="toggleCheckboxResponse(event, \'' +
              this.label +
              "')\" onclick=\"toggleCheckboxResponse(event, '" +
              this.label +
              '\')"  onfocus="focusCheckbox(event)" onblur="blurCheckbox(event)"></div></td>';
          }
        });
        str += "</tr>";
      });
    }

    str += "</tbody>";
    str += "</table>";
    str += "</div>";

    $("#" + obj.identity.id).html(str);

    //itemId will capture the responses
    let itemId = responseId;

    var captureResponse, columnResponse;
    var responseArray = new Array();

    var selectionGroup = document.querySelectorAll('[role="radio"]');
    $(selectionGroup).bind("click keydown", function(event) {
      if (event.keyCode == "32" || event.keyCode == "13" || event.type == "click") {
        $(selectionGroup).removeClass("optionSelected");
        $(this).addClass("optionSelected");

        //Capture the response from row
        captureResponse = this.parentElement.parentElement.childNodes[0].attributes[0].nodeValue;

        //Capture the response from column
        columnResponse = this.parentElement.parentElement.parentElement.previousSibling.childNodes[0].childNodes[
          this.offsetParent.cellIndex
        ].attributes[0].nodeValue;

        //Store the index of the captured row
        var indexRow = this.parentElement.parentElement;
        var x = indexRow.rowIndex;

        /*var example = "(row:" + captureResponse + "," + " column: " + columnResponse + ")";*/
        var example = columnResponse + captureResponse;
        //Push the responses from all rows to one array
        responseArray[x] = example;
        //Removing the empty response from 1st row
        var rowArray = responseArray.slice(1);
        //Remove the empty values from array
        var temp = [];
        for (let i of rowArray) i && temp.push(i); // copy each non-empty value to the 'temp' array
        rowArray = temp;
        delete temp; // discard the variable
        console.log(rowArray);
        //Join all the responses with comma seperator
        var printResponse = rowArray.join(",");
        console.log(printResponse);

        //Check if the response is required
        if (obj.required) {
          if (rowArray.length == rows.length) {
            apiTestlet.removeRequired(obj.identity.responseId);
          } else {
            apiTestlet.addRequired(obj.identity.responseId);
          }
        }

        //save response
        apiTestlet.saveResponse(scoreId, responseId, printResponse);
        //save state
        var state = captureResponse;
        apiTestlet.saveState(responseId, printResponse);
        //save console.log()
        apiTestlet.saveLog(responseId, printResponse);
      }
    });

    //Save response for the captured selected options(multi select)
    var checkboxResGroup = document.querySelectorAll('[role="checkbox"]');
    $(checkboxResGroup).bind("click keydown", function(event) {
      if (event.keyCode == "32" || event.type == "click") {
        if (arrResponse.length > obj.properties.maxSelect) {
          toggleCheckboxResponse(event, $(this).label);
          return false;
        } else {
          console.log(arrResponse);
          //save response
          apiTestlet.saveResponse(scoreId, responseId, arrResponse);
          //save state
          var state = arrResponse;
          apiTestlet.saveState(responseId, arrResponse);
          //save console.log()
          apiTestlet.saveLog(responseId, arrResponse);
        }
      }
    });

    //Check if enabled is true or false
    if (obj.properties.enabled == "false") {
      $("#" + responseGridId).addClass("disabled");
    } else if (obj.properties.enabled == "true") {
      $("#" + responseGridId).removeClass("disabled");
    }

    //Initialize the functions for accessibility and aria support
    console.log(rows.length);
    var rgList = [];
    for (var r = 0; r < rows.length; r++) {
      rgList.push(new ETS_RadioGroup(document.getElementById(r)));
      rgList[r].init();
    }
    /*if (rows.length > 4) {
            var rg0 = new ETS_RadioGroup(document.getElementById(0));
            rg0.init();
            var rg1 = new ETS_RadioGroup(document.getElementById(1));
            rg1.init();
            var rg2 = new ETS_RadioGroup(document.getElementById(2));
            rg2.init();
            var rg3 = new ETS_RadioGroup(document.getElementById(3));
            rg3.init();
            var rg4 = new ETS_RadioGroup(document.getElementById(4));
            rg4.init();
        }
        if (rows.length > 3) {
            var rg0 = new ETS_RadioGroup(document.getElementById(0));
            rg0.init();
            var rg1 = new ETS_RadioGroup(document.getElementById(1));
            rg1.init();
            var rg2 = new ETS_RadioGroup(document.getElementById(2));
            rg2.init();
            var rg3 = new ETS_RadioGroup(document.getElementById(3));
            rg3.init();
        }
        if (rows.length > 2) {
            var rg0 = new ETS_RadioGroup(document.getElementById(0));
            rg0.init();
            var rg1 = new ETS_RadioGroup(document.getElementById(1));
            rg1.init();
            var rg2 = new ETS_RadioGroup(document.getElementById(2));
            rg2.init();
        }*/
    restore.call(rgList);
    function restore() {
      if (typeof obj.state !== "undefined") {
        //Get array of state rows to restore
        var states = obj.state.split(",");
        function findIndexOfValue(choice) {
          for (var j = 0, len = columns.length; j < len; j++) {
            if (columns[j].value === choice) return j - 1;
          }
        }
        for (i = 0; i < states.length; i++) {
          var state = states[i];
          var choice = state.substring(0, 1);
          var row = state.substring(1);

          responseArray[row] = state;
          var index = findIndexOfValue(choice);

          var rg = this[row - 1];
          rg.setChecked(rg.radioButtons[index]);
        }

        if (obj.required) {
          apiTestlet.removeRequired(obj.identity.responseId);
        }
      }
    }
    //Print some values to the consoler
    cPrint("system", "component", "This is a Radio button component");
    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);
  };
})(this);
