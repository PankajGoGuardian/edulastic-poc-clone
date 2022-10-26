import { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { uniqBy } from 'lodash'
import antdNotification from '@edulastic/common/src/components/Notification'
import * as Fbs from '@edulastic/common/src/Firebase'
import { roleuser } from '@edulastic/constants'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { getUser, getUserOrgId } from '../../../src/selectors/user'
import {
  closeHangoutNotification as closeFirebaseNotification,
  destroyNotificationMessage,
} from '../../../../common/components/Notification'
import { receiveRosterLogAction } from '../../duck'

const collectionName = 'AssignmentBulkActionEvents'
const ONEROSTER_ACTION = 'ONEROSTER'

const NotificationListener = ({ user, loadRosterLogs }) => {
  const [inProgressNotificationIds, setInProgressNotificationIds] = useState([])
  const [
    failedOrCompletedNotificationIds,
    setFailedOrCompletedNotificationIds,
  ] = useState([])
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

  const onNotificationClick = (e, docId) => {
    closeFirebaseNotification(docId)
    deleteNotificationDocument(docId)
  }

  const showUserNotifications = (docs) => {
    uniqBy(docs, '__id').forEach((doc) => {
      const { message, statusCode, status, action } = doc
      if (action === ONEROSTER_ACTION) {
        if (
          status === 'inProgress' &&
          !inProgressNotificationIds.includes(doc.__id)
        ) {
          setInProgressNotificationIds([...inProgressNotificationIds, doc.__id])
          antdNotification({
            msg: `${message || 'OneRoster sync in progress.'}`,
            exact: true,
          })
        } else if (
          status === 'completed' &&
          !failedOrCompletedNotificationIds.includes(doc.__id)
        ) {
          setFailedOrCompletedNotificationIds([
            ...failedOrCompletedNotificationIds,
            doc.__id,
          ])
          loadRosterLogs()
          antdNotification({
            msg: `${message || 'OneRoster sync completed.'}`,
            type: 'success',
            exact: true,
            onClose: () => {
              onNotificationClick(event, doc.__id)
            },
          })
        } else if (
          status === 'failed' &&
          !failedOrCompletedNotificationIds.includes(doc.__id)
        ) {
          setFailedOrCompletedNotificationIds([
            ...failedOrCompletedNotificationIds,
            doc.__id,
          ])
          loadRosterLogs()
          antdNotification({
            msg: `${message || 'OneRoster sync Failed.'}`,
            type: 'error',
            exact: true,
            onClose: () => {
              onNotificationClick(event, doc.__id)
            },
          })
        }
      }
    })
  }

  useEffect(() => {
    if (user && user.role === roleuser.DISTRICT_ADMIN) {
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
    {
      loadRosterLogs: receiveRosterLogAction,
    }
  )
)(NotificationListener)
