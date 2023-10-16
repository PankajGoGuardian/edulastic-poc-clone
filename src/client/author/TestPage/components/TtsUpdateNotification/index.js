import * as Fbs from '@edulastic/common/src/Firebase'
import antdNotification from '@edulastic/common/src/components/Notification'
import { uniqBy } from 'lodash'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { destroyNotificationMessage } from '../../../../common/components/Notification'
import { getUser } from '../../../src/selectors/user'

const ttsUpdateNotificationCollection = 'TTSUpdateNotification'

const NotificationListener = ({ user, location, history }) => {
  const [notificationIds, setNotificationIds] = useState([])

  const ttsUpdateNotification = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(ttsUpdateNotificationCollection)
        .where('userId', '==', `${user?._id}`)
        .where('status', '==', 'done'),
    [user?._id]
  )

  const deleteNotificationDocument = (docId, collection) => {
    Fbs.db
      .collection(collection)
      .doc(docId)
      .delete()
      .catch((err) => console.error(err))
  }

  const showUserNotifications = (docs, collection) => {
    uniqBy(docs, '__id').forEach((doc) => {
      const {
        message,
        successCount, // how many test has been process successfully
        totalCount, // how many total test should be processed
        status,
        testId,
      } = doc

      if (status === 'done' && !notificationIds.includes(doc.__id)) {
        let _message = message

        // updating message based upon notification document for tts update
        if (collection === ttsUpdateNotificationCollection) {
          if (successCount !== totalCount) {
            _message = `Text to speech generation failed on test: #${testId.slice(
              -6
            )}. Please contact support.`
          } else {
            _message = `Text to speech is generated on test: #${testId.slice(
              -6
            )}.`
          }
        }

        setNotificationIds([...notificationIds, doc.__id])
        if (successCount === totalCount) {
          antdNotification({ type: 'success', msg: _message, key: doc.__id })
        } else {
          antdNotification({ msg: _message, key: doc.__id })
        }

        // if status is initiated and we are displaying, delete the notification document from firebase
        deleteNotificationDocument(doc.__id, collection)

        // if user at test page and tts has been processed successfully
        const isTestPage = location?.pathname?.includes(testId)

        if (successCount > 0 && isTestPage) {
          setTimeout(() => history.push(location.pathname), 3000)
        }
      }
    })
  }

  useEffect(() => {
    if (user) {
      showUserNotifications(
        ttsUpdateNotification,
        ttsUpdateNotificationCollection
      )
    }
  }, [ttsUpdateNotification])

  useEffect(
    () => () => {
      destroyNotificationMessage()
    },
    []
  )

  return null
}

export default compose(
  withRouter,
  connect((state) => ({
    user: getUser(state),
  }))
)(NotificationListener)
