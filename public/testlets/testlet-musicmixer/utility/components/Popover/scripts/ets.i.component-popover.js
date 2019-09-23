(function(object) {
  object.ETS = object.ETS || {};
  object.ETS.i = object.ETS.i || {};
  object.ETS.i.component = object.ETS.i.component || {};

  /**************Create Pop-over component**********************/

  object.ETS.i.component.popover = function(obj) {
    var content = idMapContent(obj.properties.content);
    var label = idMapContent(obj.properties.label);
    var name = idMapContent(obj.identity.name);
    var responseId = idMapContent(obj.identity.responseId);

    var popoverId = obj.identity.id + "-button";

    //Create the Popover component
    //All the properties have been declared dynamically, they will be coming from the JSON file.
    var str =
      '<div type="button" role="button" id="' +
      popoverId +
      '" name="' +
      name +
      '" aria-label="Popover" tabindex="' +
      obj.properties.tabindex +
      '" class="' +
      obj.properties.class +
      '" data-container="body" data-toggle="popover" data-placement="' +
      obj.properties.placement +
      '" data-content="' +
      content +
      '"><div></div><span>' +
      label +
      "</span></div>";

    $("#" + obj.identity.id).html(str);

    //responseid will capture the response if there is any
    $("#" + popoverId).bind("mouseup keydown", function(event) {
      if (
        event.which === "13" ||
        event.keycode === "13" ||
        event.which === "32" ||
        event.keycode === "32" ||
        event.type === "mouseup"
      ) {
        console.log("pressed");
        $("#" + popoverId).attr("aria-pressed", "true");
        var popoverLog = "clicked";
        //save state
        var state = popoverLog;
        apiTestlet.saveState(responseId, state);
        //save console.log()
        apiTestlet.saveLog(responseId, state);
      }
    });

    //Check if enabled is true/false
    if (obj.properties.enabled === "true") {
      $("#" + popoverId).attr("disabled", false);
    } else if (obj.properties.enabled === "false") {
      $("#" + popoverId).attr("disabled", true);
    }

    //Function to initialize popover
    if (obj.properties.persistent === "true") {
      $(document).ready(function() {
        //Find the parent
        var parentPanel = $("#" + popoverId)
          .parentsUntil(".winsight-panel")
          .parent();

        $('[data-toggle="popover"]').popover({
          html: true,
          title: '<a href="#" class="close">&times;</a>',
          template:
            '<div class="popover" style="max-width:' +
            $(parentPanel).width() +
            'px;  max-height:calc(100% - 7rem);" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        });
        $(document).on("click", ".popover .close", function() {
          $(this)
            .parents(".popover")
            .popover("hide");
        });
        $("#" + popoverId).addClass("persistent");
      });
    }

    if (obj.properties.persistent === "false") {
      //Find the parent
      //            var parentPanel = $('#' + popoverId).parentsUntil('.winsight-panel').parent();

      $(document).ready(function() {
        $('[data-toggle="popover"]').popover({
          html: true,
          template:
            '<div class="popover" style="max-width:30%; max-height:calc(100% - 7rem);" role="tooltip"><div class="arrow"></div><div class="popover-body"></div></div>'
        });
      });

      $("html").on("click", function(e) {
        $('[data-toggle="popover"]').each(function() {
          if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $(".popover").has(e.target).length === 0) {
            $(this).popover("hide");
          }
        });
      });
    }

    //Close the popover when clicking anywhere else
    /*$('html').on('click', function (e) {
            $('[data-toggle="popover"]').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
*/

    //Print this in the previewer consoler.
    cPrint("system", "component", "This is a Popover component");
    cPrint("system", "css", "This is a CSS class:" + obj.properties.class);
  };
})(this);
