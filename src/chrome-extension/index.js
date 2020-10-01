import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './reducers/store'
import WebSocketConnection from './hoc/WebSocketConnection'
import App from './components/App'
import { contains } from './utils'

const HOST_URL = process?.env?.HOST_URL || `http://localhost:5000`
const EXTENTION_ID =
  process?.env?.EXTENTION_ID || 'eadjoeopijphkogdmabgffpiiebjdgoo'
const isDevelopment = process?.env?.TEST_ENV === 'app'
const customAuthToken = process?.env?.AUTH_TOKEN

console.log('Environment...', { isDevelopment, customAuthToken: process?.env })

const getData = () => {
  // uncomment the below  mock data while testing app locally

  if (isDevelopment) {
    return {
      meetingID: 'rnt-jbbt-mri',
      name: 'Prajwal',
      fullName: 'Prajwal Venkatesh',
      team: 'Snapwiz',
      avatar: '',
      clientId: 'psv@gmail.com',
    }
  }

  const dataScript = contains('script', 'ds:7')
  const userData = JSON.parse(dataScript[1].text.match(/\[[^\}]*/)[0])

  return {
    meetingID: document
      .querySelector('[data-unresolved-meeting-id]')
      .getAttribute('data-unresolved-meeting-id'),
    name: userData[6]?.split(' ')[0],
    fullName: userData[6],
    team: userData[28],
    avatar: userData[5],
    clientId: userData[4],
    deviceId: document
      .querySelector('[data-initial-participant-id]')
      .getAttribute('data-initial-participant-id')
      .split('/')[3],
  }
}

const Root = () => {
  useEffect(() => {
    console.log(store)
    const userData = getData()
    const toneId = localStorage.getItem('edu-skinTone')

    chrome.runtime.sendMessage(
      EXTENTION_ID,
      { type: 'REQUEST_AUTH_TOKEN' },
      (response = {}) => {
        if (response.authToken || (isDevelopment && customAuthToken)) {
          store.dispatch({
            type: 'SET_AUTH_TOKEN',
            payload: response.authToken || customAuthToken,
          })
          console.log(
            'response.authToken',
            response.authToken || customAuthToken
          )
          localStorage.setItem(
            'eduToken',
            response.authToken || customAuthToken
          )
        } else {
          /**
           * Wait for auth token to be stored in chrome storage
           */
          ;(async () => {
            let isTokenAvailable = false
            while (!isTokenAvailable) {
              await new Promise((r) => setTimeout(r, 1000))
              console.log('Waiting for authentication...')
              chrome.runtime.sendMessage(
                EXTENTION_ID,
                { type: 'REQUEST_AUTH_TOKEN' },
                (response = {}) => {
                  if (response.authToken) {
                    isTokenAvailable = true
                    store.dispatch({
                      type: 'SET_AUTH_TOKEN',
                      payload: response.authToken,
                    })
                    console.log('response.authToken', response.authToken)
                    localStorage.setItem('eduToken', response.authToken)
                  }
                }
              )
            }
          })()
        }
      }
    )

    store.dispatch({ type: 'ADD_USER_DATA', payload: userData })
    store.dispatch({ type: 'SET_NAME', payload: userData.fullName })
    if (!isNaN(parseInt(toneId)))
      store.dispatch({ type: 'SET_TONE', payload: toneId })
    else localStorage.setItem('edu-skinTone', 0)
  }, [])

  return (
    <Provider store={store}>
      <WebSocketConnection
        host={process?.env?.HOST_URL || HOST_URL}
        extension={EXTENTION_ID}
      >
        <App />
      </WebSocketConnection>
    </Provider>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'))
