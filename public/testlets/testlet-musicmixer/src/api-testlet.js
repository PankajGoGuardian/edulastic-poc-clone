apiTestlet = {
  /*******************************************Navigation functions******************************************************/
  nextPage: function() {
    if (currentScreen < totoalScreen) {
      if (screenArr[Number(currentScreen) - 1].dynamicKey !== undefined) {
        updateDynamicKey();
      }

      let curPage = currentScreen,
        nextPage;
      if (screenArr[currentScreen - 1].branching !== undefined) {
        console.log("branching...");
        let answer = branchScoring();
        let correctPage = screenArr[currentScreen - 1].correct;
        let wrongPage = screenArr[currentScreen - 1].wrong;

        if (answer) {
          nextPage = correctPage;
          console.log("NOW GO TO CORRECT ANSWER");
        } else {
          nextPage = wrongPage;
          console.log("NOW GO TO WRONG ANSWER");
        }
      } else {
        if (screenArr[currentScreen - 1].redirectPage !== undefined) {
          nextPage = screenArr[currentScreen - 1].redirectPage;
        } else {
          nextPage = currentScreen + 1;
        }
      }
      removeScreenContent(curPage, nextPage);
      currentScreen = nextPage;
      loadScreen(nextPage, curPage);
      messageController.sendState(itemState);
    } else {
      //alert("Last page...")
      //platform chagne next to submit...
    }

    /*
        //using modal alert
        if(unlockNext){
            if(currentScreen < totoalScreen){
                removeScreenContent(currentScreen,currentScreen+1);
                currentScreen++;
                loadScreen(currentScreen,currentScreen-1);
            } else {
                alert("Last page...")
            }
        }else {
            // alert("Finish task on this page...")
            $('#exampleModalCenter').modal('show');
        }
        */
  },

  lastPage: function() {
    messageController.sendLastPage();
  },

  nextPageDev: function() {
    if (currentScreen < totoalScreen) {
      removeScreenContent(currentScreen, currentScreen + 1);
      currentScreen++;
      loadScreen(currentScreen, currentScreen - 1);
    } else {
      alert("Last page...");
    }
  },

  prevPageDev: function() {
    if (currentScreen > 1) {
      removeScreenContent(currentScreen, currentScreen - 1);
      currentScreen--;
      loadScreen(currentScreen, currentScreen + 1);
    } else {
      alert("First page...");
    }
  },

  getScenes: function() {
    let arr = getScenes();
    messageController.sendScenes(arr);
  },

  gotoScene: function(id) {
    gotoScene(id);
  },

  getScreens: function() {
    let arr = getScreens();
    messageController.sendScreens(arr);
  },

  gotoScreen: function(n) {
    gotoScreen(n);
  },

  getVersion: function() {
    let version = getVersion();
    messageController.sendVersion(version);
  },

  getFrameVersion: function() {
    let frameVersion = getFrameVersion();
    messageController.sendFrameVersion(frameVersion);
  },

  getCurrentPageScoreID: function() {
    let screenScoring = JSON.stringify(currentScreenScoring);
    messageController.sendCurrentPageScoreID(screenScoring);
  },

  getTotalPage: function(totalPage) {
    // let totalPage = getTotalPage();
    messageController.sendTotalPage(totalPage);
  },

  getCurrentPage: function(page) {
    // let page = getCurrentPage();
    messageController.sendCurrentPage(page);
  },

  changeMode: function(mode) {
    itemMode = mode;
    console.log("it is mode..." + itemMode);
  },

  addRequired: function(id) {
    if (screenArr[currentScreen - 1].requirements.indexOf(id) == -1) {
      screenArr[currentScreen - 1].requirements.push(id);

      unlockNext = screenArr[currentScreen - 1].requirements.length === 0 ? true : testlet.ignoreReq ? true : false;
      // qtiHookWinsight.UnlockNext_Reply(unlockNext);
      this.unlockNextButton(unlockNext);
    }
  },

  removeRequired: function(id) {
    screenArr[currentScreen - 1].requirements.remove(id);

    unlockNext = screenArr[currentScreen - 1].requirements.length === 0 ? true : testlet.ignoreReq ? true : false;
    // qtiHookWinsight.UnlockNext_Reply(unlockNext);
    this.unlockNextButton(unlockNext);
  },

  unlockNextButton: function(flag) {
    messageController.sendUnlockNext(flag);
  },

  /*******************************************data functions******************************************************/
  saveData: function() {
    qtiHookWinsight.SaveResponse_Event(JSON.stringify(itemResponse));
    qtiHookWinsight.SaveState_Event(JSON.stringify(itemState));
    qtiHookWinsight.SaveLog_Event(JSON.stringify(itemLog));
  },

  saveResponse: function(id_score, id_response, value) {
    if (!(id_score == "" || id_score === undefined)) {
      itemResponse[id_score] = itemResponse[id_score] || {};
      itemResponse[id_score][id_response] = value;
      messageController.sendResponse(itemResponse);
    }
  },

  saveState: function(id, value) {
    // console.log("id==="+id)
    // console.log(itemResponse)
    itemState[id] = value;
    messageController.sendState(itemState);
    // console.log("State: " + JSON.stringify(itemState))
    // window.parent.cPrint("state","property",JSON.stringify(itemState))
  },

  saveLog: function(id, value) {
    var log = {};
    log.s = value;
    log.t = new Date();
    itemLog[id] = log;
    messageController.sendLog(itemLog);
    // console.log("Log: " + JSON.stringify(itemLog))
    // window.parent.cPrint("log","property",JSON.stringify(itemLog))
    // console.log(winsightLog)
  },

  errorInfo: function(err) {
    messageController.sendError(err);
  }
};
