/* global chrome */
const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i)
  return bytes.buffer
}

const strToArrayBuffer = (mystr) => {
  const len = mystr.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = mystr.charCodeAt(i)
  return bytes.buffer
}

const deviceIdRegEx = /@spaces\/.*\/devices\/([a-f,0-9,-]*)/
const updaterIdRegExp = /@spaces\/.*\/devices\/([a-f,0-9,-]*).*\^https/g

let all_devices

const skipHeaders = [
  'Cookie',
  'User-Agent',
  'Origin',
  'Sec-Fetch-Site',
  'Sec-Fetch-Mode',
  'Sec-Fetch-Dest',
  'Referer',
  'Accept-Encoding',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
]

function create_device(request, sendResponse) {
  const xrequest = new XMLHttpRequest()
  xrequest.withCredentials = true
  xrequest.open('POST', `${request.url}?`, true) // append ? to avoid our webRequests
  for (let i = 0; i < request.headers.length; i++) {
    if (!skipHeaders.includes(request.headers[i].name)) {
      xrequest.setRequestHeader(
        request.headers[i].name,
        request.headers[i].value
      )
    }
  }
  xrequest.onerror = () => {
    console.log('** An error occurred during the transaction')
    console.log(this)
  }
  xrequest.onload = () => {
    console.log(`sending response: ${this.responseText}`)
    sendResponse({ body: this.responseText })
  }
  const request_body = base64ToArrayBuffer(request.reqbody)
  xrequest.send(request_body)
}

function update_all(action, request) {
  const mrequest = new XMLHttpRequest()
  mrequest.withCredentials = true
  mrequest.open(
    'POST',
    'https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingSpaceService/SyncMeetingSpaceCollections?',
    true
  ) // append ? to avoid our webRequests
  for (let i = 0; i < request.send_headers.length; i++) {
    if (!skipHeaders.includes(request.send_headers[i].name)) {
      mrequest.setRequestHeader(
        request.send_headers[i].name,
        request.send_headers[i].value
      )
    }
  }
  mrequest.onerror = () => {
    console.log('** An error occurred during the transaction')
    console.log(this)
  }
  mrequest.onload = () => {
    console.log(`sending response: ${this.responseText}`)
    const all_devices_response = atob(this.responseText)
    all_devices = Array.from(
      all_devices_response.matchAll(deviceIdRegEx),
      (m) => m[1]
    )
    console.log('all devices:')
    console.log(all_devices)
    console.log(request)
    const update_devices = []
    for (let i = 0; i < all_devices.length; i++) {
      if (!request.ignore_device_ids.includes(all_devices[i])) {
        update_devices.push(all_devices[i])
      }
    }
    const updater_id = [
      ...all_devices_response.matchAll(updaterIdRegExp),
    ].pop()[1]
    console.log(`updater_id: "${updater_id}"`)
    console.log('update_devices')
    console.log(update_devices)
    console.log(`update action: ${action}`)
    for (let i = 0; i < update_devices.length; i++) {
      const srequest = new XMLHttpRequest()
      srequest.withCredentials = true
      srequest.open(
        'POST',
        'https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingDeviceService/UpdateMeetingDevice?',
        true
      )
      for (let n = 0; n < request.send_headers.length; n++) {
        if (!skipHeaders.includes(request.send_headers[n].name)) {
          srequest.setRequestHeader(
            request.send_headers[n].name,
            request.send_headers[n].value
          )
        }
      }
      let sbody
      if (action === 'mute') {
        sbody = `\n\u0086\u0001\n@spaces/${request.space_id}/devices/${update_devices[i]}bB\n@spaces/${request.space_id}/devices/${updater_id}`
      } else if (action === 'kick') {
        sbody = `\nD\n@spaces/${request.space_id}/devices/${update_devices[i]} \u0007`
      }
      const body = strToArrayBuffer(sbody)
      srequest.send(body)
    }
  }
  const mbody_str = `\n\u0013spaces/${request.space_id}\u0012\u0002\n\u0000\u001a\u0002\n\u0000`
  const mbody = strToArrayBuffer(mbody_str)
  mrequest.send(mbody)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request received:')
  console.log(request)
  if (request.command == 'createDevice') {
    create_device(request, sendResponse)
  } else if (request.command == 'muteAll') {
    update_all('mute', request, sendResponse)
  } else if (request.command == 'kickAll') {
    update_all('kick', request, sendResponse)
  }
  return true
})
