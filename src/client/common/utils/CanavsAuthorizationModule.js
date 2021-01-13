import mqtt from 'mqtt'
import { notification } from '@edulastic/common'
import { getSignedUrl } from '../../author/ClassBoard/useRealtimeUpdates'

const authorizeCanvas = async (ssoUrl, subscriptionTopic) => {
  const windowArea = {
    width: Math.floor(window.innerWidth),
    height: Math.floor(window.innerHeight),
  }

  if (windowArea.width > 720) {
    windowArea.width = 720
  }
  if (windowArea.height > 650) {
    windowArea.height = 650
  }
  windowArea.left = Math.floor(
    window.screenX + (window.outerWidth - windowArea.width) / 2
  )
  windowArea.top = Math.floor(
    window.screenY + (window.outerHeight - windowArea.height) / 3
  )

  const windowOpts = `toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,
      width=${windowArea.width},height=${windowArea.height},
      left=${windowArea.left},top=${windowArea.top}`

  const authWindow = window.open(ssoUrl, '_blank', windowOpts)

  const authPromise = new Promise((resolve, reject) => {
    getSignedUrl()
      .then((signedUrl) => {
        const client = mqtt.connect(signedUrl)

        client.on('connect', () => {
          client.subscribe(subscriptionTopic, (err) => {
            if (err) {
              console.log('Error subscribing to topic: ', subscriptionTopic)
              reject(err)
              authWindow?.close()
            } else {
              console.log(
                'connection established with mqtt client',
                subscriptionTopic
              )
            }
          })
        })

        client.on('message', (topic, message) => {
          let msg = message.toString()
          msg = JSON.parse(msg)
          console.log(`response from mqtt client with topic ${topic}`, msg)
          if (msg.data.isCanvasAuthenticated) {
            resolve(msg)
          } else {
            reject(msg)
          }
          const isAuthWindowClosed = authWindow?.closed
          authWindow?.close()
          if (
            !isAuthWindowClosed &&
            (msg?.data?.message || '').includes('test_connection_success')
          ) {
            notification({
              type: 'success',
              msg: 'Canvas configuration successfully verified',
            })
          } else if (
            !isAuthWindowClosed &&
            (msg?.data?.message || '').includes('invalid_client')
          ) {
            notification({
              type: 'warn',
              msg: 'Invalid canvas secret key.',
            })
          } else if (!isAuthWindowClosed) {
            notification({
              type: 'warn',
              msg:
                'Failed to connect with canvas. Please enter the valid configuration',
            })
          }
          client.end()
        })

        client.on('error', (err) => {
          console.error('error in mqtt client', err)
          reject(err)
          authWindow?.close()
          client.end()
        })
      })
      .catch((err) => {
        console.error(err)
        reject(err)
        authWindow?.close()
      })
  })

  return authPromise
}

export default authorizeCanvas
