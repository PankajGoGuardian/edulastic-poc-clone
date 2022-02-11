import { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { uniqBy, flatMap, orderBy } from 'lodash'

import { FireBaseService as Fbs } from '@edulastic/common'
import { styledNotification } from '../author/Reports/common/styled'

import { getUser } from '../author/src/selectors/user'

// NOTE: cannot access firebase console, hence, collection could not be created and we are currently using a temp collection
// const notificationsCollectionName = 'notification-engine'
const notificationsCollectionName = 'RegradeAssignments'

const NotificationListener = ({ user }) => {
  const [notificationIds, setNotificationIds] = useState([])
  const [isNotificationVisible, setIsNotificationVisible] = useState(false)

  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(notificationsCollectionName)
        .where('userId', '==', `${user?._id}`)
        .where('notificationVariant', '==', 'engine'),
    [user?._id]
  )

  const updateNotifications = (
    docs = [],
    updateData = {},
    callback = () => {}
  ) => {
    const batch = Fbs.db.batch()
    docs.forEach((d) => {
      const ref = Fbs.db.collection(notificationsCollectionName).doc(d.__id)
      batch.update(ref, updateData)
    })
    batch
      .commit()
      .then(callback)
      .catch((err) => console.error(err))
  }

  const deleteNotification = (docId, callback = () => {}) => {
    Fbs.db
      .collection(notificationsCollectionName)
      .doc(docId)
      .delete()
      .then(callback)
      .catch((err) => console.error(err))
  }

  const showUserNotifications = (docs) => {
    let unseenCount = 0
    let unreadCount = 0

    uniqBy(docs, '__id').forEach((doc) => {
      const { status, seenStatus, readStatus, modifiedAt } = doc
      const daysDiff = (Date.now() - modifiedAt) / (24 * 60 * 60 * 1000)
      if (daysDiff > 15) {
        // delete documents older than 15 days
        deleteNotification(doc.__id)
      } else if (status === 'active' && !notificationIds.includes(doc.__id)) {
        setNotificationIds([...notificationIds, doc.__id])
        if (seenStatus == 0) {
          unseenCount += 1
          unreadCount += 1
        } else if (readStatus == 0) {
          unreadCount += 1
        }
      }
    })

    // check: if (unreadCount && !isNotificationVisible) {
    if (unreadCount) {
      setIsNotificationVisible(true)

      const prevUnreadCount = unreadCount - unseenCount
      const messageForUnseen = unseenCount
        ? `${String(unseenCount)} new notifications`
        : ''
      const messageForUnread = prevUnreadCount
        ? `${
            String(prevUnreadCount) + (messageForUnseen ? ' previously' : '')
          } unread notifications`
        : ''
      const message =
        messageForUnseen && messageForUnread
          ? `${messageForUnseen} and ${messageForUnread}`
          : messageForUnseen + messageForUnread

      styledNotification({
        type: 'success',
        duration: 10,
        msg: message,
        onClose: () => setIsNotificationVisible(false),
      })

      // todo: updateNotifications()
    }
  }

  useEffect(() => {
    if (user) {
      const flattenedUserNotifications = orderBy(
        flatMap(userNotifications),
        'modifiedAt',
        'desc'
      )
      showUserNotifications(flattenedUserNotifications)
    }
  }, [userNotifications])

  return null
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      user: getUser(state),
    }),
    {}
  )
)(NotificationListener)
