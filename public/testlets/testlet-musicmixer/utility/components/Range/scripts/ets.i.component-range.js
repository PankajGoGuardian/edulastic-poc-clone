(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /******************Create Text Component******************/

  object.ETS.i.component.range = function(obj) {
    console.log("Create Rnage Input component...");
    console.log(obj);

    //Create the Text component
    //All the properties have been declared dynamically, they will be coming from the JSON file.
    var min = idMapContent(obj.properties.min);
    var max = idMapContent(obj.properties.max);
    var now = idMapContent(obj.properties.now);
    var interval = idMapContent(obj.properties.interval);
    var range = idMapContent(obj.properties.range);
    var name = idMapContent(obj.identity.name);
    var list = obj.identity.id + "-list";
    var responseId = idMapContent(obj.identity.responseId);
    var scoreId = idMapContent(obj.identity.scoreID);

    var rangeId = obj.identity.id + "-range";

    var str = "";

    str += '<div class="winsight-slider tempo">';
    str +=
      '<input type="range" role="slider" id="' +
      rangeId +
      '" min="' +
      min +
      '" max="' +
      max +
      '" value="' +
      now +
      '" step="' +
      interval +
      '" aria-valuemin="' +
      min +
      '" aria-valuemax="' +
      max +
      '" aria-valuenow="' +
      now +
      '" class="' +
      obj.properties.class +
      '" tabindex="' +
      obj.properties.tabindex +
      '" list="' +
      list +
      '">';
    str += '<div class="winsight-range-intervals" id="' + list + '">';
    $(range).each(function(index) {
      str += '<span value="' + this.value + '">' + this.label + "</span>";
    });
    str += "</div>";
    str += "</div>";

    $("#" + obj.identity.id).html(str);

    $("#" + rangeId).on("input", function() {
      var score =
        $("#" + $(this).attr("list"))[0] != undefined
          ? $("#" + $(this).attr("list") + "> span:nth-child(" + this.value + ")").attr("value")
          : this.value;

      if (obj.required) {
        if (score !== "" || score !== null) {
          apiTestlet.removeRequired(obj.identity.responseId);
        } else {
          apiTestlet.addRequired(obj.identity.responseId);
        }
      }
      console.log(score);
      //Save Response
      apiTestlet.saveResponse(scoreId, responseId, score);
      var state = score;
      obj.state = state;
      //Save State
      apiTestlet.saveState(responseId, state);
      //Save Log
      apiTestlet.saveLog(responseId, state);
    });

    restore.call();

    function restore() {
      if (typeof obj.state !== "undefined") {
        $("#" + rangeId).val(obj.state);
        if (obj.required) {
          apiTestlet.removeRequired(obj.identity.responseId);
        }
      }
    }
    //Print this in the previewer consoler.
    cPrint("system", "component", "This is a Range Input component");

    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);
  };
})(this);
