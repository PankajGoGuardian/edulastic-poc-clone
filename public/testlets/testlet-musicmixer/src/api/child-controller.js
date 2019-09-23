/**
 * ChildController uses a message bus to create a communication channel using
 * methods that are defined for specific interactions
 */
class ChildController extends MessageController {
  constructor() {
    super("child");
  }

  /********************** call from platform ************************/
  //initialize winsight testlet
  initialize(params) {
    qtiHookWinsight.initialize(params);
    console.log("initialized from parent-controller 2...");
    // console.log("params..."+params)
  }

  /********************** next button function ****************/
  next() {
    qtiHookWinsight.NextButton_Request();
  }

  //for testing and developing
  nextDev() {
    qtiHookWinsight.NextDevButton_Request();
  }

  /********************** prev button function ****************/
  prev() {
    //no prev in winsight
  }

  //for testing and developing
  prevDev() {
    qtiHookWinsight.BackDevButton_Request();
  }

  getScenes() {
    qtiHookWinsight.ListScenes_Request();
  }

  gotoScene(id) {
    qtiHookWinsight.GotoScene_Request(id);
  }

  getScreens() {
    qtiHookWinsight.ListScreens_Request();
  }

  gotoScreen(n) {
    qtiHookWinsight.GotoScreen_Request(n);
  }

  getVersion() {
    qtiHookWinsight.Version_Request();
  }

  getFrameVersion() {
    qtiHookWinsight.FrameVersion_Request();
  }

  getCurrentPageScoreID() {
    qtiHookWinsight.CurrentPageScoreID_Request();
  }

  changeMode(mode) {
    qtiHookWinsight.ChangeMode_Request(mode);
  }

  /********************** change language function ****************/
  changeLanguage(lang) {
    console.log("lang change call... child side");
    qtiHookWinsight.ChangeLanguage_Request(lang);
  }

  /********************** prev button function ****************/
  zoom(factor) {
    //zoomIn and zoomOut
  }

  /**
   * simulate a navigation event
   * fire a event that the system will listen for and then use the communication channel to send that back to the
   * main window
   */
  simulateResponse() {
    document.dispatchEvent(new Event("response"));
  }

  simulateError() {
    window.generateError();
  }
  /********************** call from platform ************************/

  /********************** call platform ************************/
  /********************** send response function ****************/
  itemReady() {
    this.call("itemReady");
    console.log("itemReady from child...");
  }

  initDone() {
    this.call("initDone");
  }

  sendLastPage() {
    this.call("onLastPage");
  }

  sendResponse(response) {
    this.call("onResponse", [response]);
  }

  /********************** send state function ****************/
  sendState(state) {
    this.call("onState", [state]);
  }

  /********************** send log function ****************/
  sendLog(log) {
    this.call("onLog", [log]);
  }

  /********************** send error info function ****************/
  sendError(err) {
    this.call("onError", [err]);
  }

  /********************** send scene list function ****************/
  sendScenes(sceneArr) {
    this.call("onScenes", [sceneArr]);
  }

  /********************** send scene list function ****************/
  sendScreens(screenArr) {
    this.call("onScreens", [screenArr]);
  }

  sendTotalPage(total) {
    this.call("onTotalPage", [total]);
  }

  sendCurrentPage(page) {
    this.call("onCurrentPage", [page]);
  }

  sendCurrentPageScoreID(screenScoring) {
    this.call("onCurrentPageID", [screenScoring]);
  }

  sendVersion(version) {
    this.call("onVersion", [version]);
  }

  sendFrameVersion(version) {
    this.call("onFrameVersion", [version]);
  }

  sendUnlockNext(flag) {
    this.call("onUnlockNext", [flag]);
  }

  /********************** call platform ************************/
}
