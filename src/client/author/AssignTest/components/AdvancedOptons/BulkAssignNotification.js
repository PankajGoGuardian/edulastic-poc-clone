import { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { uniqBy } from 'lodash'
import * as Fbs from '@edulastic/common/src/Firebase'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { assignmentStatusOptions } from '@edulastic/constants'
import { getUser, getUserOrgId } from '../../../src/selectors/user'
import {
  destroyNotificationMessage,
  notificationMessage,
} from '../../../../common/components/Notification'

const collectionName = 'AsyncAssignmentsStatus'

const NotificationListener = ({ user }) => {
  const [notificationIds, setNotificationIds] = useState([])

  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) => db.collection(collectionName).where('userId', '==', `${user?._id}`),
    [user?._id]
  )

  const deleteNotificationDocument = (docId) => {
    Fbs.db
      .collection(collectionName)
      .doc(docId)
      .delete()
      .catch((err) => console.error(err))
  }

  const showUserNotifications = (docs) => {
    uniqBy(docs, '__id').forEach((doc) => {
      const { processStatus, tests, playlistModuleTitle, playlistTitle } = doc
      if (
        processStatus === assignmentStatusOptions.DONE &&
        !notificationIds.includes(doc.__id)
      ) {
        const { title: testTitle, totalClassesAssigned } =
          Object.values(tests)[0] || {}
        setNotificationIds([...notificationIds, doc.__id])
        let message = `Test ${testTitle} assigned to ${totalClassesAssigned} group(s) successfully`
        if (playlistModuleTitle) {
          message = `Playlist ${playlistTitle}: ${playlistModuleTitle} is assigned to the group(s) successfully`
        }
        notificationMessage({
          title: 'Async-Assign Success',
          message,
          notificationPosition: 'bottomRight',
          notificationKey: doc.__id,
          onCloseNotification: () => {
            deleteNotificationDocument(doc.__id)
          },
        })
      }
    })
  }

  useEffect(() => {
    if (user) {
      showUserNotifications(userNotifications)
    }
  }, [userNotifications])

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
  connect(
    (state) => ({
      user: getUser(state),
      orgId: getUserOrgId(state),
    }),
    {}
  )
)(NotificationListener)