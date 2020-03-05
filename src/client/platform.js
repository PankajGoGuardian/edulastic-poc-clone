// Detect if user device/platform is runing on iOS

export const isIOS = () => {
  const iDevices = ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod", "MacIntel"];

  if (!!navigator.platform) {
    while (iDevices.length) {
      const currentDevice = iDevices.pop();
      if (navigator.platform === currentDevice || navigator.userAgent.indexOf(currentDevice) !== -1) return true;
    }
  }

  return false;
};

// Detect if platform is a mobile device

export const isMobileDevice = () =>
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/webOS/i) ||
  navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/iPod/i) ||
  navigator.userAgent.match(/AppleWebKit/i)
    ? true
    : false;
