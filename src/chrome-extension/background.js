const deviceIdRegEx = /@spaces\/.*\/devices\/([a-f,0-9,-]*)/
const spaceIdRegEx = /@spaces\/(.*?)\/devices\//
let port = null

const arrayBufferToBase64 = (buffer) => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i])
  return window.btoa(binary)
}

let space_id
const ignore_device_ids = []
let create_device_body
let send_headers

const sendUpdateToinject = (command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log(command)
    console.log('ignore devices:')
    console.log(ignore_device_ids)
    const message = {
      command,
      ignore_device_ids,
      send_headers,
      space_id,
    }
    chrome.tabs.sendMessage(tabs[0].id, message, (mresponse) => {
      if (chrome.runtime.lastError) {
        console.log("no response from inject, let's just assume the best...")
      }
      console.log(mresponse)
    })
  })
}

console.log('Background Script is initialized...')

// chrome.commands.onCommand.addListener(sendUpdateToinject);

chrome.runtime.onConnectExternal.addListener((_port) => {
  port = _port

  console.log('External Script is registered on runtime port...', _port)

  port.onDisconnect.addListener(() => {
    port = null
  })

  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tabData) => {
      if (Object.keys(tabData)) {
        const {
          title,
          url,
          incognito,
          windowId,
          id,
          active,
          pinned,
          selected,
        } = tabData
        const status = +!(
          url.includes('https://meet.google.com/') ||
          url.includes('.snapwiz.net')
        )
        console.log('port', port)
        if (port) {
          port.postMessage(
            {
              type: 'TAB_ACTIVITY',
              title,
              url,
              incognito,
              windowId,
              id,
              active,
              pinned,
              selected,
              status,
            },
            () => console.log('Activity data sent...')
          )
        }
      }
    })
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`background got message with request: ${request.type}`)

  if (request.type === 'STORE_AUTH_TOKEN') {
    chrome.storage.sync.set({ authToken: request.authToken }, () =>
      sendResponse('AuthToken is Persisted !')
    )
    chrome.storage.sync.get('authToken', (obj) =>
      console.log('Auth token Persisted - ', obj)
    )
  }

  return true
})

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.type === 'REQUEST_AUTH_TOKEN') {
      chrome.storage.sync.get('authToken', (obj) => sendResponse(obj))
    }

    if (request.type === 'REQUEST_MEETINGS_STATUS') {
      chrome.windows.getAll(null, (_windows) => {
        for (const _window of _windows) {
          chrome.tabs.getAllInWindow(_window.id, (tabs) => {
            const activeUrls = tabs.map(({ url }) => url)
            const meetUrls = activeUrls.filter((url) =>
              url.includes('https://meet.google.com/')
            )
            if (meetUrls.length) {
              for (const url of meetUrls) {
                const meetingID = url.split('/').pop()
                if (meetingID.length === 12) {
                  sendResponse({ meetingID })
                  break
                }
              }
            }
          })
        }
      })
    }

    if (request.type === 'MUTE_ALL') {
      sendUpdateToinject('muteAll')
      sendResponse(true)
    }

    return true
  }
)

chrome.webRequest.onBeforeSendHeaders.addListener(
  (api) => {
    console.log(api.url)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // maybe loop through tabs ???
      chrome.tabs.sendMessage(
        tabs[0]?.id || 0,
        { type: 'REMOVE_PERSISTED_TOKEN' },
        (response = {}) => {
          if (response.auth && !response.authToken)
            chrome.storage.sync.clear(() =>
              console.log('Removed Auth Token from Storage...')
            )
          chrome.storage.sync.get('authToken', (obj) =>
            console.log('Auth token removed ? - ', obj)
          )
        }
      )
    })
    return api
  },
  { urls: ['*://*.snapwiz.net/*', '*://*.segment.io/*'] },
  ['blocking', 'requestHeaders']
)

chrome.runtime.onSuspend.addListener(() => {
  console.log('Background Script terminating due to inactivity...')
})

// watch SyncMeetingSpaceCollections and capture request headers
chrome.webRequest.onSendHeaders.addListener(
  (info) => {
    if (info.initiator != 'https://meet.google.com') {
      console.log(`Ignoring CreatingMeetingDevice call from ${info.initiator}`)
      // return {cancel: false};
    }
    send_headers = info.requestHeaders
  },
  // filters
  {
    urls: [
      'https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingSpaceService/SyncMeetingSpaceCollections',
    ],
    types: ['xmlhttprequest'],
  },
  ['requestHeaders', 'extraHeaders']
)

// watch CreatMeetingDevice and record our device ID(s)
chrome.webRequest.onBeforeRequest.addListener(
  (info) => {
    if (info.initiator != 'https://meet.google.com') {
      console.log(`Ignoring CreatingMeetingDevice call from ${info.initiator}`)
      return { cancel: false }
    }
    create_device_body = info.requestBody.raw[0].bytes
    return true
  },
  // filters
  {
    urls: [
      'https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingDeviceService/CreateMeetingDevice',
    ],
    types: ['xmlhttprequest'],
  },
  ['requestBody', 'extraHeaders']
)

chrome.webRequest.onSendHeaders.addListener(
  (info) => {
    if (info.initiator != 'https://meet.google.com') {
      console.log(`Ignoring CreatingMeetingDevice call from ${info.initiator}`)
      return { cancel: false }
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const reqbody = arrayBufferToBase64(create_device_body)
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          command: 'createDevice',
          url: info.url,
          reqbody,
          headers: info.requestHeaders,
        },
        (mresponse) => {
          const create_device_response = mresponse.body
          const create_decoded = atob(create_device_response)
          console.log(`decoded response: ${create_decoded}`)
          const result = create_decoded.match(deviceIdRegEx)
          if (result) {
            const device_id = result[1]
            ignore_device_ids.push(device_id)
            console.log(`whitelisted created device_id: ${device_id}`)
          } else {
            console.log('no device id on CreatMeetingDevice, doing nothing')
          }
          const sresult = create_decoded.match(spaceIdRegEx)
          if (sresult) {
            space_id = sresult[1]
          } else {
            console.log('no space id on CreateMeeting, uh oh')
          }
        }
      )
    })
  },
  // filters
  {
    urls: [
      'https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingDeviceService/CreateMeetingDevice',
    ],
    types: ['xmlhttprequest'],
  },
  ['requestHeaders', 'extraHeaders']
)
