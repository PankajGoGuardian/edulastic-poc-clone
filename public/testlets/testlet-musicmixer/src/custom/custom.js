/*Some global variables for beat selection*/
var objMeasure = {},
  arrMeasure = [];

function nextPage() {
  apiTestlet.nextPage();
}

function cstm() {
  var Index = screenArr[currentScreen - 1].index;
  console.log("index : " + Index);

  if ($("#textfield0004-txt").length > 0) {
    animateScrollToTarget("#textfield0004-txt", { delay: 750, parent: "#panel0003" });
  } else if ($("#content0047 .winsight-table").length > 0) {
    animateScrollToTarget(".winsight-table", { delay: 750, parent: "#panel0008R" });
  }

  $(document).ready(function() {
    if (Index === 4) {
      apiTestlet.unlockNextButton(false);
    }
    /*if (Index == 7) {
    apiTestlet.unlockNextButton(false);
}*/
    if (Index === 9) {
      apiTestlet.unlockNextButton(false);
    }
  });

  //    window.addEventListener("media_play", unlockNext_Button);
  window.addEventListener("media_stop", unlockNext_Button4);
  window.addEventListener("media_ended", unlockNext_Button4);
}

/*
function unlockNext_Button(evt) {
    if (screenArr[currentScreen - 1].index == 7) {
        console.log("Video played once");
        apiTestlet.unlockNextButton(true);
    }
}
*/

function unlockNext_Button4(evt) {
  if (screenArr[currentScreen - 1].index === 4) {
    apiTestlet.unlockNextButton(true);
  }
}

function toggleMeasure(event, val) {
  var node = event.currentTarget;
  var state = node.getAttribute("aria-checked").toLowerCase();
  var firstMeasure = node.getAttribute("tabindex");
  if (event.type === "click" && firstMeasure !== -1) {
    toggleMeasureOption(node, val, state);
    event.preventDefault();
    event.stopPropagation();
  }
}

function toggleMeasureOption(node, val, state) {
  if (state === "true") {
    node.setAttribute("aria-checked", "false");
    node.classList.remove("selected");
    objMeasure[val] = false;

    arrMeasure.splice(arrMeasure.indexOf(val), 1);
  } else {
    node.setAttribute("aria-checked", "true");
    node.classList.add("selected");
    objMeasure[val] = true;
    arrMeasure.push(val);
  }
}
