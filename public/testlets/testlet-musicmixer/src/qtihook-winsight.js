/*
 * Common modules for ETS interaction types.
 * Copyright (c) 2014 Educational Testing Service. All rights reserved.
 */
qtiHookWinsight = {
  config: {
    params: {},
    version: "v1.0"
  },

  id: -1,
  identifier: "winsight",

  requestId: "",
  language: "en_US",
  resolution: "1280",
  accnum: "none",

  response: "",
  state: "",
  log: "",

  // init item from platform or self
  initialize: function(params) {
    var paramsObj = JSON.parse(params);
    this.id = paramsObj.id || "winsight";
    this.testletID = paramsObj.testletID;
    this.response = typeof paramsObj.response === "undefined" ? {} : paramsObj.response;
    this.state = typeof paramsObj.state === "undefined" ? {} : paramsObj.state;
    // console.log(paramsObj.state)
    // this.state = paramsObj.state;
    this.language = typeof paramsObj.language === "undefined" ? this.language : paramsObj.language;
    // console.log("qti initialize here and start to work..." + this.id);
    // console.log("LANGUAGE==="+this.language);
    initState(this.response, this.state);
    initLanguage(this.language);
    loadJson(this.testletID);
  },

  Version_Request: function() {
    apiTestlet.getVersion();
  },

  FrameVersion_Request: function() {
    apiTestlet.getFrameVersion();
  },

  CurrentPageScoreID_Request: function() {
    apiTestlet.getCurrentPageScoreID();
  },

  BackButton_Request: function() {},

  BackDevButton_Request: function() {
    apiTestlet.prevPageDev();
  },

  NextButton_Request: function() {
    apiTestlet.nextPage();
  },

  NextDevButton_Request: function() {
    apiTestlet.nextPageDev();
  },

  ListScenes_Request: function() {
    apiTestlet.getScenes();
  },

  GotoScene_Request: function(id) {
    apiTestlet.gotoScene(id);
  },

  ListScreens_Request: function() {
    apiTestlet.getScreens();
  },

  GotoScreen_Request: function(n) {
    apiTestlet.gotoScreen(n);
  },

  ChangeMode_Request: function(mode) {
    apiTestlet.changeMode(mode);
  },

  SetResolution_Request: function() {},

  ChangeLanguage_Request: function(params) {
    this.language = params;
    console.log("language changes to " + this.language);
  },

  UnlockNext_Reply: function(success) {
    // if(typeof window.parent.apiControls.unlockNextButton !== 'undefined') {
    // 	window.parent.apiControls.unlockNextButton(success);
    // }
  },

  ItemReady_Event: function() {
    if (typeof window.parent.qtiCustomInteractionContext.register !== "undefined") {
      window.parent.qtiCustomInteractionContext.register(this);
      // window.parent.qtiCustomInteractionContext.initialize();
    }

    // if(typeof window.parent.ItemReady_Event !== 'undefined') {
    // 	console.log("hook winsightAPI...")
    // 	window.parent.ItemReady_Event(apiHandler)
    // }
    // else{
    // 	this.initialize();
    // }
  },

  EndOfItemReached_Event: function() {
    //lock next button
  },

  SaveResponse_Event: function(response) {
    if (typeof window.parent.apiControls.saveResponse !== "undefined") {
      window.parent.apiControls.saveResponse(response);
    }
  },

  SaveState_Event: function(state) {
    if (typeof window.parent.apiControls.saveState !== "undefined") {
      window.parent.apiControls.saveState(state);
    }
  },

  SaveLog_Event: function(log) {
    if (typeof window.parent.apiControls.saveLog !== "undefined") {
      window.parent.apiControls.saveLog(log);
    }
  },

  getResponse: function() {
    return this.response;
  },

  getSerializedState: function() {
    return this.state;
  },

  getLog: function() {
    return this.log;
  },

  getTypeIdentifier: function() {
    return this.identifier;
  },

  // The following are used by ETS only
  getExtInputParams: function() {
    return JSON.stringify(this.config.params);
  },

  saveResponseforExtUse: function(response) {
    this.response = response;
    this.SaveResponse_Event(this.response);
  },

  saveItemStateonExt: function(state) {
    this.state = state;
    this.StateChange_Event(this.state);
  },

  saveItemLogonExt: function(typeId, log) {
    var id = Number(typeId);
    this.log = log;
    var timeStamp = new Date();
    this.Observable_Event(this.log);
  },

  saveTTSTextonExt: function(ttsText) {
    //this.ttsText = ttsText;
    this.TTS_Event(ttsText);
  },

  firstTabonExt: function() {
    // this.log = log;
    // this.notifyUpdate(this.id);
    this.FirstTabReached_Event();
  },

  lastTabonExt: function() {
    // this.log = log;
    // this.notifyUpdate(this.id);
    this.LastTabReached_Event();
  },

  getExtStyleURL: function() {
    return "";
  },

  getExtCorrectResponse: function() {
    return "";
  },

  interactiveItemReady: function(success) {
    console.log("Interactive item is ready: " + success);
  }
};
