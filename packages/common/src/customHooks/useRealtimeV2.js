import API from '@edulastic/api/src/utils/API'
import { useEffect, useState } from 'react'
import mqtt from 'mqtt'

const api = new API()

export const getSignedUrl = async () => {
  const res = await api.callApi({
    url: '/realtime/url',
  })
  const url = res ? (res.data ? res.data.url : '') : ''
  return url
}

/**
 * @param {string[]} topics Topic to be listening
 * @param {{ [eventType: string]: Function }} actionMap A map of action to be performed by the action types
 * @param {Object} options
 * @returns {mqtt.MqttClient} Client which can be used to publish messages or check connected status
 */
const useRealtime = (topics, actionMap, options = {}) => {
  const [mqttUrl, setMqttUrl] = useState('')
  const [retClient, setClient] = useState(null)
  useEffect(() => {
    getSignedUrl().then((url) => {
      setMqttUrl(url)
    })
  }, [])

  useEffect(
    () => {
      if (mqttUrl === '') {
        return () => {
          console.log('connecting...')
        }
      }
      const client = mqtt.connect(mqttUrl, options)
      client.on('connect', () => {
        setClient(client)
        for (const topic of topics) {
          client.subscribe(topic, (err) => {
            if (err) {
              console.log(`error subscribing to topic ${topic} `, err)
            } else {
              console.log('connected ', topic)
            }
          })
        }
      })

      client.on('message', (_topic, message) => {
        const msg = message.toString()
        try {
          const msgObj = JSON.parse(msg)
          console.log('got', msgObj)
          const type = msgObj.type || 'unknown'
          if (actionMap[type]) {
            actionMap[type](msgObj.data)
          }
        } catch (err) {
          console.log('err', err)
        }
      })

      client.on('error', (err) => {
        console.error('error in mqtt client', err)
      })

      return () => {
        console.warn('destroying client')
        if (client) {
          try {
            client.end()
          } catch (e) {
            console.warn('error ending realtime connection', e.message, e.stack)
          }
        }
      }
    },
    options.dynamicTopics
      ? [mqttUrl, topics]
      : [mqttUrl, options.topicsWillBeAdded ? topics?.length : 1]
  )
  return retClient
}

export default useRealtime
