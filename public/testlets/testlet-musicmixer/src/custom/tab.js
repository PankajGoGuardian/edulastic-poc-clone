//For activating the tabs

//Printing the tab element
function printTab(element) {
  var myElement =
    '<div id="' +
    element.identity.id +
    '" class="' +
    element.properties.class +
    '" data-type="' +
    element.type +
    '" data-tabLabel="' +
    paramsContent[element.properties.label].content +
    '" data-subtype="' +
    element.properties.subtype +
    '"></div>';
  return myElement;
}

function prepTab() {
  //Do a pass to check if all the tabs are in the pages element if it is already printed on screen
  if ($(".tabbed").length === 1) {
    $(".winsight-panel")
      .children('[data-type="tab"]')
      .each(function(index) {
        $(this).appendTo($(".tabbed > .pages"));
      });
  }

  //START TABS
  if ($('[data-type="tab"]').length > 0 && $(".tabbed").length === 0) {
    //Add the tab pages in a pages group
    $('[data-type="tab"]').wrapAll('<div class="pages"/>');
    //Wrap the pages group with the tabbed group
    $(".pages").wrap('<div class="tabbed"/>');
    //Add a ribbon in the tab group
    $(".tabbed").prepend('<div class="ribbon"></div>');
  }

  //Get the additional tab information
  $('.tabbed .pages [data-type="tab"]').each(function(index) {
    //Print this tab if it is not yet shown
    if ($("#" + $(this).attr("id") + "_tab").length === 0) {
      //Now, add the tabs
      console.log("TABTABTAB", this);

      //Make sure there is always a subtype, even if there isn't one.
      var mySubType = $(this).data("subtype");

      if (typeof $(this).attr("subtype") !== typeof undefined) {
        mySubType = "tab";
      }

      var myId = $(this).attr("id") + "_tab";
      var myTabSubType = mySubType + "Tab";

      var myTab =
        '<div id="' +
        myId +
        '" class="tab ' +
        myTabSubType +
        '" onClick="tShowPage(\'' +
        $(this).attr("id") +
        "_tab', '" +
        $(this).attr("id") +
        "')\" > " +
        $(this).data("tablabel") +
        "</div > ";

      //if ($(this).data('subtype') === 'tab') {
      $(".ribbon").append(myTab);

      //} else if ($(this).data('subtype') === 'app') {
      //$('.ribbon > .apps').append(myTab);
      //
      //}
      //Activate the first tab
      if (index === 0) {
        tShowPage(myId, $(this).attr("id"));
      }
    }
  });

  //Now that all the tabs should have been built and rendered, let's make sure there is actually content in them. If not, remove everything from the panel.
  if ($(".tabbed > .pages").children("div").length === 0) {
    var myTabParent = $(".tabbed").parent();
    $(".tabbed").remove();

    //Now check if there are any children remaining in that parent. If not, remove it.
    if ($(myTabParent).children().length === 0) {
      $(myTabParent).remove();
    }
  }

  //Tick the last APP
  var lastAppTabLength = $(".ribbon .appTab").length - 1;

  if (lastAppTabLength >= 0) {
    var myLastTab = $(".ribbon .appTab").eq(lastAppTabLength);
    if (!myLastTab.hasClass("lastTab")) {
      myLastTab.addClass("lastTab");
    }
  }

  if ($(".lastTab").length > 1) {
    $(".lastTab").each(function(index) {
      if (index < $(".lastTab").length) {
        $(this).removeClass("lastTab");
      }
    });
  }

  //END TABS
}

//For activating the tabs
//function tShowPage(tab, page) {
//    stopMedia();
//    //first hide all the pages
//    $('[data-type="tab"]').removeClass('active');
//    //Now show the selected page
//    $('#' + page).addClass('active');
//    //Remove the highlights for all the tabs
//    $('.tab').removeClass('active');
//    //Highlight the tab
//    $('#' + tab).addClass('active');
//}
