var testlet = {},
  paramsContent = {},
  paramsContent_en = {},
  paramsContent_spa = {},
  itemResponse = {},
  itemState = {},
  itemLog = {},
  branchContent = {},
  sceneArr = [],
  screenArr = [],
  elementArr = [],
  panelArr = [],
  componentArr = [],
  version = "1.0.0",
  frameVersion = "1.3.3a",
  curLang = "en_US",
  unlockNext = true,
  itemMode = "production", //"testing"
  testletID = "default",
  outsideAutoScoring = false,
  hasBranching = false,
  currentScreenScoring = {},
  currentScreen = 1,
  totoalScreen = 0;

// var VERSION = "1.1.0";

// testlet.vendor = 'winsight';
// testlet.ignoreReq = false;

//When launching
$(document).ready(function() {
  window.messageController = new ChildController();

  // attach the message controller to the current window
  messageController.connect();
  // console.log("testlet start...");
  messageController.itemReady(); //init testlet by questar approach 1
  // console.log("-----------------")
  // qtiHookWinsight.ItemReady_Event(); //init testlet by qti
  // loadJson();
});

/****************************/

function loadJson(id) {
  testletID = id;
  var paramJson = "json/language/params_" + curLang + ".json";
  var testletJson = "json/testlet.json";

  // if(!outsideAutoScoring){
  //     $.getJSON(branchJson, function(data){
  //         branchContent = data;
  //         console.log(branchContent)
  //     });
  // }

  $.when(
    $.getJSON(testletJson, function(data) {
      console.log("==========================", data);
      init(data);
    }),
    $.getJSON(paramJson, function(data) {
      paramsContent = data;
    })
  ).then(function() {
    let testletID_json = idMapContent(testlet.testletID);
    if (testletID === testletID_json || testletID === "iCat") {
      initRestoreInfo(itemState);
      loadScreen(currentScreen);
      initVersion();
      initResponse();
      initDone();
    } else {
      // alert("wrong testletID...");
      let err = "TestletIDs from platform and testlet are not matching.";
      errorInfo(err);
    }
  });
}

function init(data) {
  testlet = data;
  initScreen(data);
  initElement(data);
  initPanel(data);
  loadBranchJson();
}

function loadBranchJson() {
  var branchJson = "json/branching.json";
  if (!outsideAutoScoring) {
    if (hasBranching) {
      $.getJSON(branchJson, function(data) {
        branchContent = data;
        // console.log(branchContent)
      });
    }
  }
}

function initDone() {
  messageController.initDone();
}

function initScreen(data) {
  let winsightDiv = document.createElement("div");
  // winsightDiv.className = "winsight";
  // winsightDiv.id = "winsight-item";
  document.body.appendChild(winsightDiv);

  let sceneDiv = document.createElement("div");
  sceneDiv.className = "ws_scene";
  sceneDiv.id = "sceneDiv";
  winsightDiv.appendChild(sceneDiv);

  let screenIndex = 0;
  data.containers.forEach(function(scene) {
    scene.properties.screens.forEach(function(screen) {
      screenIndex++;
      screen.index = screenIndex;
      screen.scene = scene.identity.name;

      if (screen.branching !== undefined) {
        hasBranching = true;
      }

      screenArr.push(screen);
    });
  });
  totoalScreen = screenArr.length;
  apiTestlet.getTotalPage(totoalScreen);
  // console.log(screenArr)
}

function initElement(data) {
  data.containers.forEach(function(scene) {
    scene.children.forEach(function(panel) {
      panel.children.forEach(function(element) {
        element.parent = panel;
        elementArr.push(element);
      });
    });
  });
  // console.log(elementArr)
}

function initPanel(data) {
  data.containers.forEach(function(scene) {
    scene.children.forEach(function(panel) {
      let panelObj = {};
      panelObj.id = panel.identity.id;
      panelObj.class = panel.properties.class;
      panelArr.push(panelObj);
    });
  });
  // console.log(panelArr)
}

function initVersion() {
  version = String(testlet.version.major) + "." + String(testlet.version.minor) + "." + String(testlet.version.patch);
  // version = idMapContent(testlet.version.major) || version;
}

function initResponse() {
  itemResponse.testletID = testletID;
}

function initState(response, state) {
  itemResponse = response;
  itemState = state;

  currentScreen = state.pageNum === undefined ? 1 : Number(state.pageNum);
}

function initRestoreInfo(data) {
  for (let i = 0; i < testlet.components.length; i++) {
    for (property in data) {
      let responseId = testlet.components[i].identity.responseId;
      // console.log("param-ID-1a" == responseId)
      // console.log(responseId)
      let responseIdMap = idMapContent(responseId);
      // let responseId = testlet.components[i].identity.responseId;
      if (responseIdMap == property) {
        testlet.components[i].state = data[property];
      }
    }
  }
  // console.log(testlet.components);
}

function initLanguage(lang) {
  curLang = lang;
}

function loadScreen(index, prev) {
  currentScreenScoring = {};
  currentScreen = index;
  itemState.pageNum = currentScreen;
  apiTestlet.getCurrentPage(currentScreen);
  let curItem = screenArr[Number(index) - 1].id;
  let lastItem = [];
  if (Number(index) - 1 > 0) {
    if (prev !== undefined) {
      lastItem = screenArr[Number(prev) - 1].id;
    }
  }

  let dif = [],
    sameCon = [];
  //contIdArr = [];

  curItem.forEach(function(item1) {
    let flag = true;
    var itemkey1, itemkey2;
    if (typeof item1 != "string") {
      itemkey1 = Object.keys(item1)[0];
    } else {
      itemkey1 = item1;
    }
    //contIdArr.push(itemkey1);

    lastItem.forEach(function(item2) {
      if (typeof item2 != "string") {
        itemkey2 = Object.keys(item2)[0];
      } else {
        itemkey2 = item2;
      }
      if (itemkey1 == itemkey2) flag = false;
    });
    if (flag) dif.push(itemkey1);
    else sameCon.push(itemkey1);
  });
  // console.log("cont=====",contIdArr)
  // console.log("dif=====",dif)
  // console.log("sameCon=====",sameCon)

  dif.forEach(function(elem) {
    let el = findElement(elem);
    loadElement(el, el.parent);
  });

  //create panels
  panelArr.forEach(function(panel) {
    let id = panel.id;
    if (document.getElementById(id)) {
      if ($("#" + id).children().length <= 0) {
        $("#" + id).remove();
      }
    }
  });

  //tab
  curItem.forEach(function(item) {
    if (typeof item != "string") {
      displayTabContent(item);
    }
  });

  //create components
  for (let i = 0; i < testlet.components.length; i++) {
    let moduleId = testlet.components[i].identity.id;
    let created = testlet.components[i].created;

    if (document.getElementById(moduleId) && $("#" + moduleId).children().length <= 0) {
      if (testlet.components[i].stateFrom !== undefined && testlet.components[i].state === undefined) {
        testlet.components[i].state = getPrevPageState(testlet.components[i].stateFrom);
      }

      ETS.i.component.createComponent(testlet.components[i]);
      // testlet.components[i].created = true;

      let score_id = idMapContent(testlet.components[i].identity.scoreID);
      let resp_id = idMapContent(testlet.components[i].identity.responseId);
      if (!(testlet.components[i].identity.scoreID === undefined || score_id == "")) {
        itemResponse[score_id] = itemResponse[score_id] || {};
        itemResponse[score_id][resp_id] = itemResponse[score_id][resp_id] || "";
        console.log("Create component..." + testlet.components[i].identity.scoreID);

        currentScreenScoring[score_id] = currentScreenScoring[score_id] || [];
        currentScreenScoring[score_id].push(resp_id);
      }
    }
  }
  console.log("currentScreenScoring...", JSON.stringify(currentScreenScoring));

  //lock components
  if (screenArr[Number(index) - 1].lock !== undefined) {
    lockComponents(screenArr[Number(index) - 1].lock);
  }

  //unlock components
  if (screenArr[Number(index) - 1].unlock !== undefined) {
    unlockComponents(screenArr[Number(index) - 1].unlock);
  }

  //next page lock/unlock
  unlockNext = screenArr[Number(index) - 1].requirements.length === 0 ? true : false;
  console.log("unlock===" + unlockNext);

  if (screenArr[Number(index) - 1].nextDelay !== undefined) {
    let t = screenArr[Number(index) - 1].nextDelay * 1000;
    apiTestlet.unlockNextButton(false);
    setTimeout(function() {
      apiTestlet.unlockNextButton(unlockNext);
    }, t);
  } else {
    apiTestlet.unlockNextButton(unlockNext);
  }

  //trigger screen function if needed
  if (screenArr[Number(index) - 1].function !== undefined) {
    var fn = screenArr[Number(index) - 1].function;
    var arr1 = fn.split(",");
    var arg1 = arr1[0];
    var arg2 = [];
    for (var i = 1; i < arr1.length; i++) {
      arg2.push(arr1[i]);
    }

    ETS.i.component.trigger(arg1, arg2);
  }

  //dynamic keys
  if (screenArr[Number(index) - 1].dynamicKey !== undefined) {
    let scoId = screenArr[Number(index) - 1].dynamicKey;
    let respId = screenArr[Number(index) - 1].staticRespID;
    itemResponse[scoId] = {};
    itemResponse[scoId][respId] = screenArr[Number(index) - 1].staticKey;
    itemResponse[scoId]["d001-ne-r2"] = "(4," + itemResponse["gtc-s002"]["s002-ne-r1"] + ")";
    itemResponse[scoId]["d001-ne-r3"] = "(5," + itemResponse["gtc-s002"]["s002-ne-r2"] + ")";
    itemResponse[scoId]["d001-ne-r4"] = "(6," + itemResponse["gtc-s002"]["s002-ne-r3"] + ")";
    dynamic_key1 = itemResponse[scoId]["d001-ne-r2"];
    dynamic_key2 = itemResponse[scoId]["d001-ne-r3"];
    dynamic_key3 = itemResponse[scoId]["d001-ne-r4"];
  }

  console.log(currentScreen + "/" + totoalScreen);
  if (currentScreen == totoalScreen) {
    // alert("reach last page...")
    //send last page message to platform, next changing to submit
    apiTestlet.lastPage();
  }

  //sorting contents
  /* for (let n = contIdArr.length, i = n - 2; i >= 0; i--) {
        console.log("content id: ", contIdArr[i])
        let no1 = $("#" + contIdArr[i]);
        let no2 = $("#" + contIdArr[i + 1]);

        let p1 = no1.parent().prop("id");
        let p2 = no2.parent().prop("id");
        console.log("parent1===", p1)
        console.log("parent2===", p2)
        if (p1 == p2) {
            no1.insertBefore(no2);
        } else {
            no1.parent().insertBefore(no2.parent());
        }

    }*/

  // Dispatch this event after page loads
  // In custom.js or UI_custom.js you can listen for this event using window.addEventListener("loadScreenComplete", screenLoaded);
  // Then add a function called screenLoaded() to add functionality.
  window.dispatchEvent(new CustomEvent("loadScreenComplete"));

  //Assign screen data attribute
  $(".testlet-player").attr("data-screen", "screen-" + currentScreen);

  //create alert modal
  // createAlertModal();
}

function displayTabContent(item) {
  let itemkey = Object.keys(item)[0];
  let content = item[itemkey];
  $("#" + itemkey)
    .children()
    .hide();
  content.forEach(function(id) {
    if (typeof id == "string") {
      $("#" + id).show();
    } else {
      $("#" + Object.keys(id)[0]).show();
      displayTabContent(id);
    }
  });
}

function lockComponents(arr) {
  arr.forEach(function(id) {
    $("#" + id).addClass("disabledDiv");
  });
}

function unlockComponents(arr) {
  arr.forEach(function(id) {
    $("#" + id).removeClass("disabledDiv");
  });
}

function createAlertModal() {
  let alertMessage =
    typeof testlet.alerts !== "undefined"
      ? idMapContent(testlet.alerts["next"].message)
      : "You have not completed all the task on this page";
  let alertTitle = typeof testlet.alerts !== "undefined" ? idMapContent(testlet.alerts["next"].title) : "Alert Message";
  let elem =
    '<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
    '<div class="modal-dialog" role="document">' +
    '<div class="modal-content">' +
    '<div class="modal-header">' +
    '<h5 class="modal-title" id="exampleModalLongTitle">' +
    alertTitle +
    "</h5>" +
    '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span>' +
    "</button>" +
    "</div>" +
    '<div class="modal-body">' +
    alertMessage +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";
  let btn =
    '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">' +
    "Launch demo modal" +
    "</button>";

  $("body").append(elem);
  // $(window.top).append(elem);
}

function idMapContent(id) {
  let content = "";
  if (!(id === null || id === "" || typeof id === "undefined")) {
    if (typeof paramsContent[id] !== "undefined" && typeof paramsContent[id].content !== "undefined") {
      content = paramsContent[id].content;
    }
  }
  return content;
}

function findElement(id) {
  for (let i = 0, m = elementArr.length; i < m; i++) {
    if (elementArr[i].identity.id == id) {
      return elementArr[i];
    }
  }
}

function loadElement(element, parent) {
  let parentId = parent.identity.id;
  if (!document.getElementById(parentId)) {
    let panel = parent;
    let panelDiv = document.createElement("div");
    panelDiv.className = panel.properties.class;
    panelDiv.id = parentId;
    document.getElementById("sceneDiv").appendChild(panelDiv);
  }

  //For default content
  var myElement =
    '<div id="' +
    element.identity.id +
    '" class="' +
    element.properties.class +
    '" data-type="' +
    element.type +
    '"></div>';

  //For tabs
  if (element.type === "tab") {
    myElement = printTab(element);
  }

  //PZFIX - for tab replacement
  $("#" + parentId).append(myElement);

  //Check if there are any nested elements
  if (element.children.length != 0) {
    element.children.forEach(function(elem) {
      myElement += loadElement(elem, element);
    });
  }
  $("#" + element.identity.id).append(idMapContent(element.properties.content));

  // Dispatch this event after lement loads
  window.dispatchEvent(new CustomEvent("loadElementComplete"));
}

function removeScreenContent(cur, next) {
  let curIds = screenArr[Number(cur) - 1].id;
  let nextIds = screenArr[Number(next) - 1].id;
  let dif = [];

  curIds.forEach(function(item1) {
    let flag = true;
    var itemkey1, itemkey2;
    if (typeof item1 != "string") {
      itemkey1 = Object.keys(item1)[0];
    } else {
      itemkey1 = item1;
    }

    nextIds.forEach(function(item2) {
      if (typeof item2 != "string") {
        itemkey2 = Object.keys(item2)[0];
      } else {
        itemkey2 = item2;
      }
      if (itemkey1 == itemkey2) flag = false;
    });
    if (flag) dif.push(itemkey1);
  });

  var myNode = document.getElementById("sceneDiv");
  dif.forEach(function(id) {
    // console.log("curent ids === "+id);
    let element = document.getElementById(id);
    element.outerHTML = "";
    delete element;
  });
}

function getScenes() {
  testlet.containers.forEach(function(scene) {
    sceneArr.push(scene.identity);
  });
  return sceneArr;
}

function gotoScene(id) {}

function getScreens() {
  return screenArr;
}

function gotoScreen(n) {
  // console.log("goto screen " + n);
  removeScreenContent(currentScreen, n);
  loadScreen(n, currentScreen);
  currentScreen = Number(n);
}

function getVersion() {
  return version;
}

function getFrameVersion() {
  return frameVersion;
}

function errorInfo(err) {
  apiTestlet.errorInfo(err);
}

function getPrevPageState(id) {
  let state;
  testlet.components.forEach(function(component) {
    if (id == component.identity.id) {
      state = component.state;
    }
  });
  return state;
}

function parseIICResponse(response) {
  // console.log("iic string parsing...")
  let type = screenArr[currentScreen - 1].iicParse;
  switch (type) {
    case "LineAndPoint1": //first part string
      response = response[0]; //parseLineAndPoint(response,"LineAndPoint1");
      break;
    case "LineAndPoint2": //second part string
      response = response[1]; //parseLineAndPoint(response,"LineAndPoint2");
      break;
    case "LineAndPoint3": //second part string
      response = parseLineAndPoint(response, type);
      break;
  }

  return response;
}

function branchScoring() {
  let answer;
  if (outsideAutoScoring) {
    //call api scoring outside
  } else {
    let curKey = "screen" + currentScreen;
    let key = branchContent[curKey].split("|");
    let resp = getBranchResponse(screenArr[currentScreen - 1].branching);
    console.log("Key ===" + key);
    console.log("response===" + resp);

    if (key.indexOf(resp) !== -1) {
      answer = true;
    } else {
      answer = false;
    }
  }

  return answer;
}

function getBranchResponse(idArr) {
  let response = "";
  // let scoId = idMapContent(id);

  idArr.forEach(function(id) {
    if (typeof id == "string") {
      let scoId = idMapContent(id);
      for (var key in itemResponse) {
        if (itemResponse.hasOwnProperty(key)) {
          if (scoId == key) {
            // need sort here*************************************************
            for (var item in itemResponse[key]) {
              let temp = itemResponse[key][item];
              if (screenArr[currentScreen - 1].evaluation == "yes") {
                temp = eval(temp);
              }
              response += temp + " ";
            }
          }
        }
      }
    } else {
      let idKey = Object.keys(id)[0];
      let idValueArr = Object.values(id)[0];
      console.log("idValueArr", idValueArr);
      let scoId = idMapContent(idKey);
      console.log("scoId", scoId);
      for (var key in itemResponse) {
        if (itemResponse.hasOwnProperty(key)) {
          if (scoId == key) {
            // need sort here*************************************************
            let n = 0;
            for (var item in itemResponse[key]) {
              n++;
              if (idValueArr.indexOf(n) != -1) {
                let temp = itemResponse[key][item];
                if (screenArr[currentScreen - 1].evaluation == "yes") {
                  temp = eval(temp);
                }
                response += temp + " ";
              }
            }
          }
        }
      }
    }
  });

  response = response.slice(0, -1);

  return response;
}

function cPrint(tab, type, message) {
  if (typeof window.parent.cPrint !== "undefined") {
    window.parent.cPrint(tab, type, message);
  }
}

/*
//Show the dialog window
function showDialog(title, content, buttons) {
    if (!buttons || buttons.length === 0) {
        buttons = [{
            label: 'Ok',
            style: 'dialog',
            action: 'closeMessage()'
        }];
    }

    //Remove any existing dialog
    $('.ws_dialog').remove();

    //Add the new dialog
    $('#testlet-player').append('<div class="ws_dialog"><div class="background"></div><div class="ws_window"><div class="title">' + title + '</div><div class="content">' + content + '</div><div class="interaction"></div></div></div>');


    $(buttons).each(function (index) {
        $('.ws_dialog .interaction').append('<div class="ws_button ' + this.style + '" onClick="' + this.action + '">' + this.label + '</div>');
    });
}

//Close the dialog window
function closeDialog() {
    $('.ws_dialog').remove();
}
*/

Array.prototype.remove = function() {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

//PZFIX
// window.addEventListener('loadElementComplete', function(e) {
//   scanPage(e);
// });

// window.addEventListener('loadScreenComplete', function(e) {
//   scanPage(e);
// });

function scanPage(e) {
  //A cleanup of all the displayed content on the page
  console.log("");
  console.log("***********************");
  console.log("scanPage event:", e.type);
  console.log("***********************");
  console.log("");

  //The basics for each element and screen event

  $(".popover").remove();
  cstm(); //
  //prepTab(); //Remove this and put only on initialization of testlet.
  stopMedia();

  //Render the initial tab instance if none is there yet.
  prepTab();

  //Check if MML needs to be rendered
  if ($('[data-testletMML="true"]').length > 0) {
    scannr();
  }
}
