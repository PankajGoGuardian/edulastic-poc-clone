var testn = 0,
  IIC,
  responseIIC,
  stateIIC,
  logIIC,
  logTotal,
  logArr = [],
  iicName,
  currentObj = {},
  iicItemArr = [];

window.initialize = function(apiHandler) {
  IIC = apiHandler;

  currentObj = iicItemArr.shift();
  let scoreID = idMapContent(currentObj.identity.scoreID);
  let responseId = idMapContent(currentObj.identity.responseId);
  let responseIdMap = currentObj.identity.responseId;
  let accnum = currentObj.properties.accnum + "_" + curLang || "10000_" + curLang;

  var stateParam = "";
  if (typeof currentObj.state !== "undefined") {
    let state = currentObj.state;
    stateParam = "<taskConfiguration>" + state + "</taskConfiguration>";
    apiTestlet.removeRequired(currentObj.identity.responseId);
  }

  var initParam =
    "<params><scoreID>" +
    scoreID +
    "</scoreID>" +
    stateParam +
    "<requestId>" +
    responseId +
    "</requestId><requestIdMap>" +
    responseIdMap +
    "</requestIdMap><taskId>" +
    accnum +
    "</taskId><colorTheme>default</colorTheme></params>";

  IIC.InitializeSetting_Request(initParam);
  iicName = IIC.identifier;
  // console.log("IIC name==="+IIC.identifier)
};

/*
window.InitializeSetting_Request = function(paramString) {
	this.interaction.InitializeSetting_Request(paramString);
}

window.VersionNumber_Request = function(paramString){
	this.interaction.VersionNumber_Request(paramString);
}

window.PauseItem_Request = function(paramString){
	this.interaction.PauseItem_Request(paramString);
}

window.ResumeItem_Request = function(paramString){
	this.interaction.ResumeItem_Request(paramString);
}

window.ItemStateInfo_Request = function(paramString){
	this.interaction.ItemStateInfo_Request(paramString);
}

window.TTSToggle_Request = function(paramString){
	this.interaction.TTSToggle_Request(paramString);
}

window.FirstTabStop_Request = function(paramString){
	this.interaction.FirstTabStop_Request(paramString);
}

window.LastTabStop_Request = function(paramString){
	this.interaction.LastTabStop_Request(paramString);
}

window.ChangeColorTheme_Request = function(paramString){
	this.interaction.ChangeColorTheme_Request(paramString);
}

window.ChangeLanguage_Request = function(paramString){
	this.interaction.ChangeLanguage_Request(paramString);
}

window.BackButton_Request = function(paramString){
	this.interaction.BackButton_Request(paramString);
}

window.GotoScene_Request = function(paramString){
	this.interaction.GotoScene_Request(paramString);
}

window.GotoSceneNext_Request = function(paramString){
	this.interaction.GotoSceneNext_Request(paramString);
}

window.GotoScenePrevious_Request = function(paramString){
	this.interaction.GotoScenePrevious_Request(paramString);
}

window.NextButton_Request = function(paramString){
	this.interaction.NextButton_Request(paramString);
}

window.ListScenes_Request = function(paramString){
	this.interaction.ListScenes_Request(paramString);
}

window.Scratchwork_Request = function(paramString){
	this.interaction.Scratchwork_Request(paramString);
}

window.SetResolution_Request = function(paramString){
	this.interaction.SetResolution_Request(paramString);
}

window.CodeToggle_Request = function(paramString){
	this.interaction.CodeToggle_Request(paramString);
}
*/

window.InitializeSetting_Reply = function(requestId, success) {
  // console.log('IIC initialization done. Item requestId is ' + requestId + '. InitializeSetting ' + success);
  // var outText = document.getElementById("showOutput");
  // outText.value = 'IIC initialization done. \r\nItem requestId is ' + requestId + '. InitializeSetting ' + success;
};

window.VersionNumber_Reply = function(requestId, success, version) {
  // console.log('Current IIC version is ' + version + '.');
};

window.PauseItem_Reply = function(requestId, success, stateInfo) {
  // console.log('Pause state= ' + stateInfo + '.');
};

window.ResumeItem_Reply = function(requestId, success) {
  // console.log('Resume state: ' + success + '.');
};

window.ItemStateInfo_Reply = function(requestId, success, stateInfo) {
  // console.log('StateInfo: ' + stateInfo + '.');
};

window.TTSToggle_Reply = function(requestId, success) {
  // console.log('TTS state: ' + success + '.');
};

window.FirstTabStop_Reply = function(requestId, success) {};

window.LastTabStop_Reply = function(requestId, success) {
  console.log("Reach last tab...");
};

window.ChangeColorTheme_Reply = function(requestId, success) {
  console.log("Change color theme..." + success);
};

window.ChangeLanguage_Reply = function(requestId, success) {
  console.log("Change language..." + success);
};

window.BackButton_Reply = function(requestId, success) {};

window.GotoScene_Reply = function(requestId, success) {};

window.GotoSceneNext_Reply = function(requestId, success) {};

window.GotoScenePrevious_Reply = function(requestId, success) {};

window.NextButton_Reply = function(requestId, success) {};

window.ListScenes_Reply = function(requestId, success, scenes) {};

window.Scratchwork_Reply = function(requestId, success) {};

window.SetResolution_Reply = function(requestId, success) {};

window.CodeToggle_Reply = function(requestId, success) {};

window.ItemReady_Event = function(success, apiHandler) {
  console.log("ItemReady_Event");
  window.initialize(apiHandler);
};

window.EndOfItemReached_Event = function() {};

window.SaveResponse_Event = function(response, scoreID, requestId, requestIdMap) {
  // console.log('Response event...' + response);
  if (screenArr[currentScreen - 1].iicParse !== undefined) {
    response = parseIICResponse(response);
  }

  apiTestlet.saveResponse(scoreID, requestId, response);

  console.log("iic response====" + response);
  if (response == "" || response == undefined) {
    apiTestlet.addRequired(requestIdMap);
  } else {
    apiTestlet.removeRequired(requestIdMap);
  }
};

window.StateChange_Event = function(state, requestId) {
  // console.log('State event...' + state)
  apiTestlet.saveState(requestId, state);
  currentObj.state = state;
};

window.Observable_Event = function(typeId, eventTime, extendedInfo, requestId) {
  apiTestlet.saveLog(requestId, JSON.stringify(extendedInfo));
};

window.TTS_Event = function(txt) {
  console.log("Reading text: " + txt);
  // var outText = document.getElementById("showOutput");
  // outText.value = 'TTS text is: ' + txt;
};

window.FirstTabReached_Event = function() {
  console.log("Leave first tab...");
  // var outText = document.getElementById("showOutput");
  // outText.value = 'Tab out from the first tab of the item. Give the tab control to Naep platform.';
};

window.LastTabReached_Event = function() {
  console.log("Leave last tab...");
  // var outText = document.getElementById("showOutput");
  // outText.value = 'Tab out from the last tab of the item. Give the tab control to Naep platform.';
};

window.ActiveScene_Event = function(sceneIdx, sceneId) {};

window.AdvanceProgressBar_Event = function(progress) {};

window.NavigationToggleEnabled_Event = function(btn, enable) {};

window.Error_Event = function(message) {
  console.log(message);
};
