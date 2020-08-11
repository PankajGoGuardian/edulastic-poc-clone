console.log("Background Script is initialized...");

chrome.runtime.onConnectExternal.addListener((port) => {
    console.log("External Script is registered runtime port...");
    chrome.tabs.onActivated.addListener( (activeInfo) => {
      chrome.tabs.get(activeInfo.tabId, tabData => {
        if(Object.keys(tabData)){
          const { title, url, incognito, windowId, id, active, pinned, selected} = tabData;
          const status = +!(url.includes('https://meet.google.com/') ||  url.includes('.snapwiz.net'));
          if(port){
            port.postMessage({
              type: "TAB_ACTIVITY",
              title, 
              url, 
              incognito, 
              windowId, 
              id, 
              active, 
              pinned, 
              selected,
              status
            }, () => console.log("Activity data sent..."));
          }
        } 
      });
    })
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.type === 'STORE_AUTH_TOKEN'){
        chrome.storage.sync.set({'authToken': request.authToken}, () => sendResponse("AuthToken is Persisted !"));
        chrome.storage.sync.get('authToken', obj => console.log("Auth token Persisted - ",obj));
        return true;
    }
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    if(request.type === 'REQUEST_AUTH_TOKEN'){
        chrome.storage.sync.get('authToken', obj => sendResponse(obj));
        return true;
    }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    (api) => {
        console.log(api.url);
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            // maybe loop through tabs ??? 
            chrome.tabs.sendMessage(tabs[0]?.id || 0, {type: "REMOVE_PERSISTED_TOKEN"}, (response={}) => {
            if(response.auth && !response.authToken) chrome.storage.sync.clear(() => console.log("Removed Auth Token from Storage..."));
            chrome.storage.sync.get('authToken', obj => console.log("Auth token removed ? - ",obj));
            });  
        });
      return api;
    },
    {urls: ["*://*.snapwiz.net/*", "*://*.segment.io/*"]},
    ["blocking",  "requestHeaders"]);

chrome.runtime.onSuspend.addListener(() => {
    console.log("Background Script terminating due to inactivity...");
});