import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as Fbs from '@edulastic/common/src/Firebase'
import { uniqBy, pull } from 'lodash'
import { getUser } from '../author/src/selectors/user'
import {
  closeHangoutNotification,
  destroyNotificationMessage,
  notificationMessage,
} from '../common/components/Notification'

const hangoutFirestoreCollectionName = 'HangoutsClassEvents'

const NotificationListener = ({ user }) => {
  const [notificationIds, setNotificationIds] = useState([])
  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(hangoutFirestoreCollectionName)
        .where('studentID', '==', `${user?._id}`),
    [user?._id]
  )

  const updateNotificationStatus = (docId, status) => {
    Fbs.db
      .collection(hangoutFirestoreCollectionName)
      .doc(docId)
      .update({ status })
  }

  const closeNotification = (event, key, status) => {
    // update status to closed
    if (status !== 'closed') {
      updateNotificationStatus(key, 'closed')
    }
    setNotificationIds([...pull(notificationIds, [key])])
  }

  const onNotificationClick = (event, key, status) => {
    // update status to clicked
    if (status !== 'clicked' && event?.target?.tagName.toLowerCase() === 'a') {
      closeHangoutNotification(key)
      updateNotificationStatus(key, 'clicked')
    }
  }

  const showUserNotifications = (docs) => {
    uniqBy(docs, '__id').map((doc) => {
      const { classID, hangoutLink, status, modifiedAt, studentID } = doc
      const groupInfo = user.orgData.classList.filter(
        (o) => o._id === classID
      )[0]
      const modifiedDateTime = new Date(modifiedAt.seconds * 1000).getTime()
      const currentDateTime = new Date().getTime()
      if (
        hangoutLink &&
        (status === 'initiated' || status === 'viewed') &&
        currentDateTime < modifiedDateTime + 60 * 60 * 1000 &&
        !notificationIds.includes(doc.__id)
      ) {
        // check district policy if hangout meet is enabled
        const hangoutEnabledDistrictMap = (
          user.orgData.districtPolicies || []
        ).reduce((acc, o) => {
          acc[o.districtId] = o.enableGoogleMeet
          return acc
        }, {})

        // check school policy if hangout meet is enabled
        const hangoutEnabledSchoolMap = (
          user.orgData.schoolPolicies || []
        ).reduce((acc, o) => {
          acc[o.schoolId] = o.enableGoogleMeet
          return acc
        }, {})

        const isHangoutEnabled =
          (groupInfo.districtId &&
            hangoutEnabledDistrictMap[groupInfo.districtId]) === true
            ? true
            : (groupInfo.institutionId &&
                hangoutEnabledSchoolMap[groupInfo.institutionId]) === true
            ? true
            : false
        if (isHangoutEnabled) {
          setNotificationIds([...notificationIds, doc.__id])
          notificationMessage({
            title: 'Google Meet Video Call',
            message: `Google Meet video call is starting for ${groupInfo.name} class.`,
            showButton: true,
            buttonLink: hangoutLink,
            buttonText: 'CLICK HERE TO JOIN',
            notificationPosition: 'bottomRight',
            notificationKey: doc.__id,
            onCloseNotification: () => {
              closeNotification(event, doc.__id, status)
            },
            onButtonClick: () => {
              onNotificationClick(event, doc.__id, status)
            },
          })
          if (status === 'initiated') {
            // if status is initiated and we are displaying, convert status to viewed
            updateNotificationStatus(doc.__id, 'viewed')
          }
        }
      }
    })
  }

  useEffect(
    () => () => {
      destroyNotificationMessage()
    },
    []
  )

  useEffect(() => {
    if (user && user.role === 'student') {
      showUserNotifications(userNotifications)
    }
  }, [userNotifications])
  return null
}

export default compose(
  connect(
    (state) => ({
      user: getUser(state),
    }),
    {}
  )
)(NotificationListener)
