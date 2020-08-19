const inject = (file_path, type = "script", tag = "html") => {
    const node = document.getElementsByTagName(tag)[0];
    const tag_type = type == "link" ? "link" : "script";
    const script = document.createElement(tag_type);
    if (type == "script") {
      script.setAttribute("type", "text/javascript");
    } else if (type == "module") {
      script.setAttribute("type", "module");
    } else {
      script.setAttribute("rel", "stylesheet");
      script.setAttribute("media", "screen");
    }
  
    script.setAttribute(tag_type == "script" ? "src" : "href", file_path);
  
    node.appendChild(script);
  };
  
  (async () => {
    
    const hostname = window.location.hostname || "";
    const match = hostname.match(/[a-z-]*.snapwiz.net/g);
    const isOriginEdulastic = match && match[0] === hostname;
    if(isOriginEdulastic){
      let token = JSON.parse(localStorage.getItem('tokens'))?.[0];
      let authToken = localStorage.getItem(token);

      while (!authToken) {
        await new Promise((r) => setTimeout(r, 2000));
        token = JSON.parse(localStorage.getItem('tokens'))?.[0];
        authToken = localStorage.getItem(token);
      }

      if(authToken){
        chrome.runtime.sendMessage({type: "STORE_AUTH_TOKEN",authToken}, response => console.log(response));
      }

      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if(request.type === 'REMOVE_PERSISTED_TOKEN'){
            token = JSON.parse(localStorage.getItem('tokens'))?.[0];
            authToken = localStorage.getItem(token);
            sendResponse({auth: true, authToken});
          }
          return true;
    });
    }else{
      // Wait until in call && participant-id DOM is mounted
      while (document.querySelector(".d7iDfe") !== null || document.querySelector("[data-initial-participant-id]") === null) {
        await new Promise((r) => setTimeout(r, 500));
      } 
    
      // Create wrapper for React App
      const app = document.createElement("DIV");
      app.setAttribute("id", "root");
      document.body.prepend(app);
    
      // Inject script into page
      console.log("Injecting Contents....");
      inject(chrome.runtime.getURL("bundle.js"), "script", "html");
      inject(chrome.runtime.getURL("0.bundle.js"), "script", "html");
      inject(chrome.runtime.getURL("1.bundle.js"), "script", "html");
      inject(chrome.runtime.getURL("2.bundle.js"), "script", "html");
      console.log("Injecting Content Done....");
    }

  })();
  