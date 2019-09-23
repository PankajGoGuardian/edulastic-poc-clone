// This is for UI designer to add custom functionality
window.addEventListener("loadScreenComplete", screenLoaded);

/*
window.addEventListener("unloadScreen", unloadScreen);

function unloadScreen() {
    console.log(">>> unloadScreen", $("#content0001"));
}
*/

function screenLoaded() {
  console.log("screenLoaded: " + screenArr[currentScreen - 1].scene + " | " + screenArr[currentScreen - 1].index);

  if ($(".musicRoom").length === 0 && $(".mrBackground").length > 0) {
    $(".mrBackground").remove();
  }

  //cleanup
  window.removeEventListener("media_play", playNotes);
  window.removeEventListener("media_stop", stopNotes);
  window.removeEventListener("media_ended", mediaEnded);
  window.removeEventListener("media_loaded", addMeasures);
  $("#panel0001")
    .removeClass()
    .addClass("winsight-panel fullscreen");
  $("#titleImage").remove();
  $("#panel0009")
    .removeClass()
    .addClass("winsight-panel fullscreen");

  //screens
  screenArr[currentScreen - 1].index === 1 && $("#panel0001").addClass("intro");
  screenArr[currentScreen - 1].index === 1 &&
    $("#panel0001").append(
      '<div class="titleImage" id="titleImage"><img src="assets/img/Title_Screen_Music_Art_Image.png" id="titleImage-img" alt="musical notes image" class="winsight-image"></div>'
    );

  screenArr[currentScreen - 1].index === 2 && $("#panel0001").addClass("musicRoom");
  screenArr[currentScreen - 1].index === 2 && $("#panel0001").prepend('<div class="mrBackground"></div>');

  screenArr[currentScreen - 1].index === 3 && addNotes("#content0004");

  screenArr[currentScreen - 1].index === 4 && addNotes("#content0067");
  screenArr[currentScreen - 1].index === 4 && $("#text1058").addClass("hidden");

  screenArr[currentScreen - 1].index === 9, 10 && window.addEventListener("media_loaded", addMeasures);
  screenArr[currentScreen - 1].index === 9 && window.addEventListener("media_play", checkMeasures);

  screenArr[currentScreen - 1].index === 13 && addNotes("#content0068");

  screenArr[currentScreen - 1].index === 19 && addNotes("#content0042");

  screenArr[currentScreen - 1].index === 24 && addNotes("#content0064");
  screenArr[currentScreen - 1].index === 24 && $("#text0063").addClass("hidden");

  screenArr[currentScreen - 1].index === 25 && $("#panel0009").addClass("musicRoom");
  screenArr[currentScreen - 1].index === 25 && $("#panel0009").prepend('<div class="mrBackground"></div>');
}

function addNotes(content) {
  window.addEventListener("media_play", playNotes);
  window.addEventListener("media_stop", stopNotes);
  window.addEventListener("media_ended", mediaEnded);

  if ($("#image0016").length === 0 && $("#image0019").length === 0 && $("#image0013").length === 0) {
    if ($(content).find("#image0005").length === 0) {
      $(content)
        .find(".imageWrapper")
        .eq(0)
        .append(
          '<div class="musicNote redSmall" id="note1"><span></span></div><div class="musicNote blue" id="note2"><span></span></div><div class="musicNote yellow" id="note3"><span></span></div><div class="musicNote orange" id="note4"><span></span></div><div class="musicNote blue" id="note5"><span></span></div>'
        ); // drum notes
      $(content)
        .find(".imageWrapper")
        .eq(1)
        .append(
          '<div class="musicNote purple" id="note6"><span></span></div><div class="musicNote orange" id="note7"><span></span></div><div class="musicNote redLarge" id="note8"><span></span></div><div class="musicNote blue" id="note9"><span></span></div>'
        ); // piano notes
      $(content)
        .find(".imageWrapper")
        .eq(2)
        .append(
          '<div class="musicNote blue" id="note10"><span></span></div><div class="musicNote redSmall" id="note11"><span></span></div><div class="musicNote yellow" id="note12"><span></span></div>'
        ); // guitar notes
    }
  } else {
    $(content)
      .find(".imageWrapper")
      .eq(1)
      .append(
        '<div class="musicNote redSmall" id="note1"><span></span></div><div class="musicNote blue" id="note2"><span></span></div><div class="musicNote yellow" id="note3"><span></span></div><div class="musicNote orange" id="note4"><span></span></div><div class="musicNote blue" id="note5"><span></span></div><div class="musicNote purple" id="note6"><span></span></div><div class="musicNote orange" id="note7"><span></span></div><div class="musicNote redLarge" id="note8"><span></span></div><div class="musicNote blue" id="note9"><span></span></div><div class="musicNote redLarge" id="note10"><span></span></div><div class="musicNote yellow" id="note11"><span></span></div><div class="musicNote purple" id="note12"><span></span></div>'
      ); // piano notes
  }
}

function playNotes(evt) {
  // console.log("!!! media_play !!!");
  //console.log(evt.detail.target.id);

  var _delay = 0; // delay because all audio has 1 second before music plays
  if (evt.detail.target.currentTime < 1) {
    _delay = (1 - evt.detail.target.currentTime) * 1000;
  }
  console.log("delay: ", _delay);
  switch (evt.detail.target.id) {
    case "video0001-media":
      $(evt.detail.target)
        .delay(_delay)
        .queue(function() {
          $("#image0021")
            .find(".musicNote")
            .addClass("jiggle");
        });
      break;
    case "video0002-media":
      $(evt.detail.target)
        .delay(_delay)
        .queue(function() {
          $("#image0022")
            .find(".musicNote")
            .addClass("jiggle");
        });
      break;
    case "video0003-media":
      $(evt.detail.target)
        .delay(_delay)
        .queue(function() {
          $("#image0023")
            .find(".musicNote")
            .addClass("jiggle");
        });
      break;
    case "audio0001-media":
      _delay = 0;
      $(evt.detail.target)
        .delay(_delay)
        .queue(function() {
          $(".musicNote").addClass("jiggle");
        });
      break;
    default:
      $(evt.detail.target)
        .delay(_delay)
        .queue(function() {
          $(".musicNote").addClass("jiggle");
        });
      break;
  }
}

function addMeasures() {
  // console.log($("#video0007-media"));
  var measureHTML_str = '<div class="measure-container">';
  var totalBeats = 0;
  for (m = 0; m < 6; m++) {
    measureHTML_str += '<div class="measure-zone" id="measure' + m + '">';
    for (b = 0; b < 4; b++) {
      measureHTML_str +=
        '<button class="measure-beat" aria-checked="false" value="' +
        String.fromCharCode(97 + totalBeats) +
        '" onclick="toggleMeasure(event, \'' +
        String.fromCharCode(97 + totalBeats) +
        '\')"><div class="measure-line"></div></button>';
      totalBeats++;
    }
    measureHTML_str += "</div>";
  }

  measureHTML_str += "</div >";
  $("#video0007-media")
    .parent()
    .append(measureHTML_str);
  $("#measure0 .measure-beat:first-of-type").attr("tabindex", "-1");
  $("#measure0 .measure-beat:first-of-type").addClass("selected");

  //Set the scoreId and responseId for the container
  $(".measure-container").attr("scoreId", "mmx-s004");
  $(".measure-container").attr("responseId", "s004-zonems-r1");

  $(".measure-zone .measure-beat").click(function(event) {
    // $(this).parent().find(".measure-beat").removeClass("selected");
    //        $(this).attr("tabindex") != -1 && $(this).toggleClass("selected");
    console.log(arrMeasure);
    if (arrMeasure.length >= 1) {
      apiTestlet.unlockNextButton(true);
    } else {
      apiTestlet.unlockNextButton(false);
    }
    apiTestlet.saveResponse(
      $(".measure-container").attr("scoreId"),
      $(".measure-container").attr("responseId"),
      arrMeasure
    );
  });
}

function checkMeasures() {
  var checkEnded = document.getElementById("video0007-player").getAttribute("ended");
  console.log(checkEnded);
  if (checkEnded === "false") {
    if ($('[data-screen="screen-9"]').length > 0) {
      $(".measure-zone .measure-beat").removeClass("selected");
      $(".measure-zone .measure-beat").attr("aria-checked", "false");
      arrMeasure = [];
      apiTestlet.unlockNextButton(false);
      apiTestlet.saveResponse(
        $(".measure-container").attr("scoreId"),
        $(".measure-container").attr("responseId"),
        arrMeasure
      );
      $("#measure0 .measure-beat:first-of-type").addClass("selected");
    }
  }
}

function stopNotes(evt) {
  // console.log("!!! ended !!!");
  $(evt.detail.target)
    .clearQueue()
    .dequeue();
  $(".musicNote").removeClass("jiggle");
  //    $("#content0005").addClass("hidden");
  $("#text1058").removeClass("hidden");
  $("#text0063").removeClass("hidden");
}

function mediaEnded(evt) {
  // console.log("!!! ended !!!");
  $(evt.detail.target)
    .clearQueue()
    .dequeue();
  $(".musicNote").removeClass("jiggle");
  //    $("#content0005").addClass("hidden");
  $("#text1058").removeClass("hidden");
  //    $("#content0062").addClass("hidden");
  $("#text0063").removeClass("hidden");
}

function animateScrollToTarget(_target, _params) {
  /*
   * Function scrolls the scrolling div to a specific target
   *Usage:
   * animateScrollToTarget("#id or .class"); // default: no delay, 1s speed, scrollable is direct parent
   * Optional parameters can be added:
   * delay // override delay. Example: animateScrollToTarget("#id", { delay: 2000 }); // 2 second delay
   * offset // add or subtract an additional offset (to compensate for child padding). Example: animateScrollToTarget("#id", { offset: 20 }); // 20 pixel offset
   * speed // override speed. Example: animateScrollToTarget("#id", { speed: 3000 }); // 3 second animation speed
   * parent // override scrolling parent. Example: animateScrollToTarget("#id", { parent: "#panel0002" }); // This passes ID #panel0002 as the scrolling parent
   * callback // add a callback function . Example: animateScrollToTarget("#id", { callback: onComplete() }); //  callback should be passed as a variable. Example: var onComplete = function () { doSomething };
   * location // default is bottom, you can pass top. Example: animateScroll("#id", { location: "top" }); // scroll to top instead of bottom
   */

  var _delay = _params && _params.delay ? _params.delay : 0;
  var _offset = _params && _params.offset ? _params.offset : 0;
  var _speed = _params && _params.speed ? _params.speed : 1000;
  var _parent = _params && _params.parent ? _params.parent : undefined;
  var _callback = _params && _params.callback ? _params.callback : undefined;
  var _location = _params && _params.location ? _params.location : "top";

  $(_target)
    .stop(true, true)
    .delay(_delay)
    .queue(function(next) {
      var parentDiv = _parent !== undefined ? $(_parent) : $($(_target).parent());
      var scrollPos;
      // calculate height of target if 0
      if ($(_target).height() === 0) {
        var totalHeight = 0;
        $(_target)
          .children()
          .each(function() {
            totalHeight = totalHeight + $(this).outerHeight(true);
          });
        $(_target).height(totalHeight);
      }

      if (_location === "top") {
        scrollPos = $(parentDiv).scrollTop() - $(parentDiv).offset().top + $(_target).offset().top;
      } else {
        var _targetHeight =
          $(_target).outerHeight() !== 0
            ? $(_target).outerHeight()
            : $(_target)
                .children()
                .outerHeight();
        scrollPos =
          $(parentDiv).scrollTop() +
          $(_target).offset().top -
          ($(parentDiv).outerHeight() - _targetHeight) -
          $(parentDiv).offset().top +
          _offset;
      }
      $(parentDiv)
        .stop(true, true)
        .animate(
          {
            scrollTop: scrollPos
          },
          {
            easing: "swing",
            duration: _speed,
            complete: _callback
          }
        );
      $(this)
        .clearQueue()
        .dequeue();
      next();
    });
}

function animateScroll(_target, _params) {
  /*
   * Function scrolls the scrolling div to bottom/top
   *Usage:
   * animateScroll("#id or .class"); // default: no delay, 1s speed, scrollable is direct parent
   * Optional parameters can be added:
   * delay // override delay. Example: animateScroll("#id", { delay: 2000 }); // 2 second delay
   * speed // override speed. Example: animateScroll("#id", { speed: 3000 }); // 3 second animation speed
   * callback // add a callback function . Example: animateScroll("#id", { callback: onComplete() }); //  callback should be passed as a variable. Example: var onComplete = function () { doSomething };
   * location // default is bottom, you can pass top. Example: animateScroll("#id", { location: "top" }); // scroll to top instead of bottom
   */

  var _delay = _params && _params.delay ? _params.delay : 0;
  var _speed = _params && _params.speed ? _params.speed : 1000;
  var _callback = _params && _params.callback ? _params.callback : undefined;
  var _location = _params && _params.location ? _params.location : "bottom";

  var scrollPos;
  if (_location === "top") {
    scrollPos = 0;
  } else {
    scrollPos = $(_target)[0].scrollHeight - $(_target).height();
  }
  $(_target)
    .delay(_delay)
    .queue(function(next) {
      $(this)
        .stop(true, true)
        .animate(
          {
            scrollTop: scrollPos
          },
          {
            easing: "swing",
            duration: _speed,
            complete: _callback
          }
        );
      $(this)
        .clearQueue()
        .dequeue();
      next();
    });
}

/*
function itemChange(evt) {

}
*/
