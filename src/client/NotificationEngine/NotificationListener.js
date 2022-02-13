import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { orderBy, uniqBy, map, max, filter } from 'lodash'

import { FireBaseService as Fbs } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { themeColor } from '@edulastic/colors'
import { styledNotification } from '../author/Reports/common/styled'

import {
  notificationsCollectionName,
  notificationStatus,
  updateUserNotifications,
  deleteUserNotifications,
} from './helpers'
import { getUser } from '../author/src/selectors/user'
import { receiveNotificationsRequestSuccessAction } from './ducks'

const NotificationListener = ({ history, user, setNotifications }) => {
  const [notificationIds, setNotificationIds] = useState([])
  const [isNotificationVisible, setIsNotificationVisible] = useState(false)

  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(notificationsCollectionName)
        .where('userId', '==', `${user?._id}`),
    [user?._id]
  )

  const showUserNotifications = (notificationsToShow) => {
    const unseenCount = notificationsToShow.length
    const maxDuration = max(
      map(notificationsToShow, (doc) => doc.duration || 0)
    )
    if (unseenCount > 0) {
      const message = (
        <>
          {String(unseenCount)} new notification(s).
          <span
            style={{ color: themeColor, cursor: 'pointer' }}
            onClick={() =>
              user.role === roleuser.STUDENT
                ? history.push('/home/notifications')
                : history.push('/author/notifications')
            }
          >
            {' Go to Notifications. '}
          </span>
        </>
      )
      styledNotification({
        type: 'success',
        duration: maxDuration || 10,
        msg: message,
        onClose: () => setIsNotificationVisible(false),
      })
    }
  }

  useEffect(() => {
    if (user && userNotifications.length && !isNotificationVisible) {
      const notificationsToDelete = []
      const notificationsUpcoming = []
      const notificationsToShow = []
      const notificationsUnread = []
      const notifications = orderBy(
        filter(uniqBy(userNotifications, '__id'), (doc) => {
          const daysDiff = (Date.now() - doc.expiresAt) / (24 * 60 * 60 * 1000)
          const activeAt = doc.activeAt || doc.createdAt
          if (daysDiff > 1) {
            notificationsToDelete.push(doc)
            return false
          }
          if (Date.now() <= activeAt) {
            notificationsUpcoming.push(doc)
            return false
          }
          if (
            doc.status == notificationStatus.INITIATED &&
            !notificationIds.includes(doc.__id)
          ) {
            notificationsToShow.push(doc)
          } else if (doc.status == notificationStatus.SEEN) {
            notificationsUnread.push(doc)
          }
          return true
        }),
        // sort docs in descending order by activeAt & expiresAt
        ['activeAt', 'expiresAt'],
        ['desc', 'desc']
      ).sort((a, b) => {
        // sort archived docs to the bottom
        const aVal = a.status === notificationStatus.ARCHIVED ? 1 : 0
        const bVal = b.status === notificationStatus.ARCHIVED ? 1 : 0
        return aVal - bVal
      })

      // TODO: remove logs later
      console.log(
        '\n\n\n\nNotifications To Delete',
        JSON.parse(JSON.stringify(notificationsToDelete))
      )
      console.log(
        '\nNotifications Upcoming',
        JSON.parse(JSON.stringify(notificationsUpcoming))
      )
      console.log(
        '\nNotifications To Show',
        JSON.parse(JSON.stringify(notificationsToShow))
      )
      console.log(
        '\nNotifications Unread',
        JSON.parse(JSON.stringify(notificationsUnread))
      )
      console.log('\nNotifications', JSON.parse(JSON.stringify(notifications)))

      if (notificationsToShow.length > 0) {
        setNotificationIds([
          ...notificationIds,
          ...notificationsToShow.map((doc) => doc.__id),
        ])
        setIsNotificationVisible(true)
        // display notifications message
        showUserNotifications(notificationsToShow)
        // update user notifications with seen status
        updateUserNotifications(notificationsToShow, {
          status: notificationStatus.SEEN,
        })
      }
      if (notificationsToDelete.length > 0) {
        deleteUserNotifications(notificationsToDelete)
      }
      // TODO: update redux state - @neeraj
      setNotifications(notifications)
    }
  }, [userNotifications, isNotificationVisible])

  return null
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      user: getUser(state),
    }),
    {
      setNotifications: receiveNotificationsRequestSuccessAction,
    }
  )
)(NotificationListener)
