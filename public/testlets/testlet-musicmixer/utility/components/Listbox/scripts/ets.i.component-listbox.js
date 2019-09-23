(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Listbox Component******************/
  object.ETS.i.component.listbox = function(obj) {
    console.log("Create Listbox...");
    console.log(obj);

    //Create the Listbox component
    //All the properties have been declared dynamically, they will be coming from the JSON file.

    var options = idMapContent(obj.properties.options);

    var listboxId = obj.identity.id + "-txt";

    var responseId = idMapContent(obj.identity.responseId);

    var listboxName = idMapContent(obj.identity.name);

    var str = "";

    str +=
      '<select id="' +
      listboxId +
      '" name="' +
      listboxName +
      '" class="' +
      obj.properties.class +
      '" role="listbox" aria-label="listbox-component" tabindex="' +
      obj.properties.tabindex +
      '" multiple="multiple" size="' +
      obj.properties.maxSize +
      '">';

    $(options).each(function(index) {
      if (this.selected === "true") {
        str += '<option value="' + this.value + '" selected>' + this.label + "</option>";
      } else if (this.selected === "false") {
        str += '<option value="' + this.value + '">' + this.label + "</option>";
      }
    });

    str += "</select>";

    $("#" + obj.identity.id).html(str);

    //itemId will capture the responses
    let itemId = responseId;

    //Check if enabled is true/false
    if (obj.properties.enabled == "true") {
      $("#" + listboxId).attr("disabled", false);
    } else if (obj.properties.enabled == "false") {
      $("#" + listboxId).attr("disabled", true);
    }

    //Check if maxSelect is there, limit the selections from listbox

    $(document).ready(function() {
      var last_valid_selection = null;
      $("#" + listboxId).change(function(event) {
        if ($(this).val().length > obj.properties.maxSelect) {
          $(this).val(last_valid_selection);
        } else {
          last_valid_selection = $(this).val();
        }
      });
    });

    //function to save the response
    var valid_selection = null;
    $("#" + listboxId).bind("click keypress", function(event) {
      if ($(this).val().length > obj.properties.maxSelect) {
        $(this).val(valid_selection);
      } else {
        valid_selection = $(this).val();
      }
      //save response
      apiTestlet.saveResponse(responseId, valid_selection);
      //save state
      var state = valid_selection;
      apiTestlet.saveState(responseId, state);
      //save console.log()
      apiTestlet.saveLog(responseId, state);
    });

    //If you want to set the height of listbox to auto
    /*$("#" + listboxId).attr("size", function () {
    return this.options.length;
});*/

    //Print some values to the consoler

    cPrint("system", "component", "This is a Listbox component");
    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);
    cPrint("system", "property", "This is a maximum size property:" + obj.properties.maxSize);
    cPrint("system", "property", "Number of options you can select from Listbox:" + obj.properties.maxSelect);
  };
})(this);
