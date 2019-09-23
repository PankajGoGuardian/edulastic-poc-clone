/* eslint-disable */
import MessageController from "./messageController";
import testler from "../../data/testler";

var initLang = "en_US";
var itemState = {};
var itemResponse = {};
var totalPage = "0";

class ParentController extends MessageController {
  constructor() {
    super("parent");
  }

  /********************** call from testlet ************************/
  //testlet ready to init
  itemReady() {
    console.log("itemReady from parent...");
    this.initialize();
  }

  //testlet initialization done, ready to test
  initDone() {
    console.log("item initialization done, ready for testing...");
    // this.getScenes();
    this.getScreens();
    this.getVersion();
    this.getFrameVersion();

    //Remove existing MML libraries
    if (testler.config.removeTestletHeaderSources.length > 0) {
      removeHeaderNodes();
    }

    //Adding the MML library
    if (testler.config.localMML) {
      //insertTestletMML();
    }
  }

  onLastPage() {
    //reach last page, change next button to submit button
    console.log("testlet reaches the last page...");
  }

  //get response data from testlet
  onResponse(response) {
    itemResponse = response;
    // console.log(JSON.stringify(response));
    // cPrint("response", "property", JSON.stringify(response));
  }

  //get state data from testlet
  onState(state) {
    // console.log(JSON.stringify(state));
    itemState = state;
    // cPrint("state", "property", JSON.stringify(state));
  }

  //get log data from testlet
  onLog(log) {
    // console.log(JSON.stringify(log));
    // cPrint("log", "property", JSON.stringify(log));
  }

  //get error info from testlet
  onError(err) {
    console.log(err);
    alert(err);
  }

  //get scene info from testlet
  onScenes(sceneArr) {
    console.log("get testlet scenes...");
    console.log(sceneArr);
  }

  //get screen info from testlet
  onScreens(screenArr) {
    console.log("get testlet screenArr...");
    // console.log(screenArr);
    // initScreenDropdown(screenArr);
  }

  onTotalPage(total) {
    console.log("get testlet total page number..." + total);
    totalPage = total;
  }

  onCurrentPage(page) {
    // console.log("get testlet current page..."+page);
    // curPage = page;
    // document.getElementById("page_testler").innerHTML = page + "/" + totalPage;
    // this.getCurrentPageScoreID();
  }

  onCurrentPageID(currentScoring) {
    console.log("get testlet current page score opportunity ids..." + currentScoring);
  }

  //get version number from testlet
  onVersion(version) {
    // console.log("get testlet version..." + version);
    // tversion = version;
    // document.getElementById("version_testler_testlet").innerHTML = "v" + version;
  }

  //get framework version number from testlet
  onFrameVersion(version) {
    // console.log("get testlet framework version..." + version);
    // fversion = version;
    // document.getElementById("version_testler_framework").innerHTML = fversion;
    // document.getElementById("version_testler_testlet").innerHTML = tversion;
    // //Get the style version
    // var useFrame = document.getElementById("testlet");
    // var useVersion = window
    //   .getComputedStyle(useFrame.contentWindow.document.getElementById("winsight-item"))
    //   .getPropertyValue("--version")
    //   .trim();
    // useVersion = useVersion.substr(1, String(useVersion).length - 2);
    // document.getElementById("version_testler_USE").innerHTML = useVersion;
  }

  //get version number from testlet
  onUnlockNext(flag) {
    // console.log("Next Button unlock..."+flag);
    //unlock next button according to flag true or false
    //unlock next: true
    //lock next: false
    if (flag) {
      if ($("#nav-0001").hasClass("disabled")) {
        $("#nav-0001").removeClass("disabled");
      }
    } else {
      $("#nav-0001").addClass("disabled");
    }
  }

  /******************** call testlet ***********************/
  initialize() {
    var params = {};
    // params.id = id;
    //testing state params, data will from platform database
    // var itemResponse = {};
    // var itemState = {};
    var testletID = "iCat";
    // var initLang = 'en_US';

    console.log("from class testletID === " + testletID);
    params.response = itemResponse;
    params.state = itemState;
    params.language = initLang;
    params.testletID = testletID;
    var initParams = JSON.stringify(params);
    this.call("initialize", [initParams]);
    console.log("initialized from parent-controller...");
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
    console.log("lang change call...");
  }
}

export default ParentController;
