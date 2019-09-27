/* eslint-disable */
import MessageController from "./messageController";

class ParentController extends MessageController {
  constructor(testletID) {
    super("parent");
    this.testletID = testletID || "iCat";
    this.initLang = "en_US";
    this.itemState = {};
    this.response = {};
    this.totalPage = "0";
    this.currentPageIds = {};

    // callbacks for React component
    this.setTotalPage = null;
    this.setQuestions = null;
    this.setCurrentQuestion = null;
    this.unlockNext = null;
    this.handleReponse = null;
  }

  /*********** set callback for updating React component and Redux */
  setCallback(callbacks = {}) {
    this.setTotalPage = callbacks.setTotalPage;
    this.setQuestions = callbacks.setQuestions;
    this.setCurrentQuestion = callbacks.setCurrentQuestion;
    this.unlockNext = callbacks.unlockNext;
    this.handleReponse = callbacks.handleReponse;
  }

  /********************** call from testlet ************************/
  // testlet ready to init
  itemReady() {
    console.log("itemReady from parent...");
    this.initialize();
  }

  // testlet initialization done, ready to test
  initDone() {
    this.getScenes();
    this.getScreens();
    this.getVersion();
    this.getFrameVersion();
  }

  onLastPage() {
    // reach last page, change next button to submit button
    console.log("parent :: testlet reaches the last page...");
  }

  // get response data from testlet
  onResponse(response) {
    this.response = response;
    if (this.handleReponse && typeof this.handleReponse === "function") {
      setTimeout(this.handleReponse);
    }
  }

  // get state data from testlet
  onState(state) {
    this.itemState = state;
  }

  // get log data from testlet
  onLog(log) {
    // console.log("parent :: get log data from testlet");
    // console.log(JSON.stringify(log));
  }

  // get error info from testlet
  onError(err) {
    console.log(err);
  }

  // get scene info from testlet
  onScenes(sceneArr) {}

  // get screen info from testlet
  onScreens(screenArr) {
    if (this.setQuestions) {
      this.setQuestions(screenArr);
    }
  }

  onTotalPage(total) {
    if (this.setTotalPage) {
      this.setTotalPage(total);
    }
    this.totalPage = total;
  }

  onCurrentPage(page) {
    if (this.setCurrentQuestion) {
      this.setCurrentQuestion(page);
    }
  }

  onCurrentPageID(currentScoring) {
    this.currentPageIds = JSON.parse(currentScoring);
  }

  // get version number from testlet
  onVersion(version) {
    console.log("parent :: get testlet version..." + version);
  }

  // get framework version number from testlet
  onFrameVersion(version) {
    console.log("parent :: get testlet framework version..." + version);
  }

  //get version number from testlet
  onUnlockNext(flag) {
    if (this.unlockNext) {
      this.unlockNext(flag);
    }
  }

  /******************** call testlet ***********************/
  initialize() {
    const params = {
      response: this.response,
      state: this.itemState,
      language: this.initLang,
      testletID: this.testletID
    };
    const initParams = JSON.stringify(params);
    this.call("initialize", [initParams]);
    console.log("parent :: initialized from parent-controller...");
  }

  sendNext() {
    this.call("next");
  }

  sendNextDev() {
    this.call("nextDev");
  }

  sendPrevious() {
    this.call("prev");
  }

  sendPrevDev() {
    this.call("prevDev");
  }

  getScenes() {
    this.call("getScenes");
  }

  gotoScene(id) {
    this.call("gotoScene", [id]);
  }

  getScreens() {
    this.call("getScreens");
  }

  gotoScreen(n) {
    this.call("gotoScreen", [n]);
  }

  getVersion() {
    this.call("getVersion");
  }

  getFrameVersion() {
    this.call("getFrameVersion");
  }

  getCurrentPageScoreID() {
    this.call("getCurrentPageScoreID");
  }

  changeMode(mode) {
    this.call("changeMode", [mode]);
  }

  changeLanguage(lang) {
    this.call("changeLanguage", [lang]);
    console.log("parent :: lang change call...");
  }
}

export default ParentController;
