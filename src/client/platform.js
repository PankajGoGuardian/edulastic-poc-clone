// Detect if user device/platform is runing on iOS

export const isIOS = () => {
  const iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod',
  ]

  if (navigator.platform) {
    while (iDevices.length) {
      const currentDevice = iDevices.pop()
      if (
        navigator.platform === currentDevice ||
        navigator.userAgent.indexOf(currentDevice) !== -1
      )
        return true
    }
  }

  return false
}

// Detect if platform is a mobile device

export const isMobileDevice = () =>
  !!(
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    'ontouchstart' in document?.documentElement
  )

// Detect if user device/platform is running on Windows
export const isWindows = () => navigator.platform.indexOf('Win') > -1
