import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  FireBaseService as Fbs,
  notification as antdNotification,
} from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { uniqBy, pull } from 'lodash'
import notification from '@edulastic/common/src/components/Notification'
import {
  destroyNotificationMessage,
  closeHangoutNotification as closeFirebaseNotification,
  notificationMessage,
} from '../../../../common/components/Notification'
import { getUser } from '../../../src/selectors/user'

import {
  fetchStudentsByIdAction,
  removeClassSyncNotificationAction,
  setGroupSyncDataAction,
  setSyncClassLoadingAction,
} from '../../../ManageClass/ducks'
import { fetchGroupsAction } from '../../../sharedDucks/groups'
import { setAssignmentBulkActionStatus } from '../../../AssignmentAdvanced/ducks'

const firestoreGoogleClassSyncStatusCollection = 'GoogleClassSyncStatus'
const firestoreBulkActionCollection = 'AssignmentBulkActionEvents'
const DOWNLOAD_GRADES_AND_RESPONSE = 'DOWNLOAD_GRADES_AND_RESPONSE'
const ClassSyncNotificationListener = ({
  user,
  removeClassSyncDetails,
  fetchStudentsById,
  setSyncClassLoading,
  setGroupSyncData,
  fetchGroups,
  setBulkActionStatus,
}) => {
  const [notificationIds, setNotificationIds] = useState([])
  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(firestoreGoogleClassSyncStatusCollection)
        .where('userId', '==', `${user?._id}`),
    [user?._id]
  )

  const bulkActionNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(firestoreBulkActionCollection)
        .where('userId', '==', `${user?._id}`)
        .where('action', '==', DOWNLOAD_GRADES_AND_RESPONSE),
    [user?._id]
  )

  const deleteNotificationDocument = (docId) => {
    Fbs.db
      .collection(firestoreBulkActionCollection)
      .doc(docId)
      .delete()
      .catch((err) => console.error(err))
  }

  const closeNotification = (event, key, data) => {
    // delete the doc from firestore
    setNotificationIds([...pull(notificationIds, [key])])
    // execute delete request
    removeClassSyncDetails()
    const { groupId, studentsSaved } = data
    if (groupId) {
      fetchStudentsById({ classId: groupId })
    } else {
      if (studentsSaved) {
        setGroupSyncData(studentsSaved)
      }
      setSyncClassLoading(false)
      fetchGroups()
    }
  }

  const showUserNotifications = (docs) => {
    uniqBy(docs, '__id').map((doc) => {
      const { status, studentsSaved, counter, groupId, message } = doc

      if (
        (status === 'completed' || counter === 0) &&
        !notificationIds.includes(doc.__id)
      ) {
        setNotificationIds([...notificationIds, doc.__id])
        // show sync complete notification
        notification({
          msg: message || 'Class sync task completed.',
          type: message ? 'error' : 'success',
          onClose: () => {
            closeNotification(event, doc.__id, { groupId, studentsSaved })
          },
        })
      }
    })
  }

  const onNotificationClick = (e, docId) => {
    /**
     * Note: As this function gets invoked on clicking anywhere in the notification.
     * So making sure that the user clicked on Download button in the notification by
     * and only than the notification document is getting deleted.
     */
    if (e?.target?.tagName.toLowerCase() === 'a') {
      closeFirebaseNotification(docId)
      deleteNotificationDocument(docId)
    }
  }

  useEffect(
    () => () => {
      destroyNotificationMessage()
    },
    []
  )

  useEffect(() => {
    if (user && user.role === roleuser.TEACHER) {
      showUserNotifications(userNotifications)
    }
  }, [userNotifications])

  useEffect(() => {
    if (user && user.role === roleuser.TEACHER) {
      uniqBy(bulkActionNotifications, '__id').map((doc) => {
        const {
          status,
          processStatus,
          message,
          isBulkAction,
          statusCode,
          action,
          downloadLink,
        } = doc
        if (
          isBulkAction &&
          status === 'initiated' &&
          processStatus === 'done' &&
          !notificationIds.includes(doc.__id)
        ) {
          setNotificationIds([...notificationIds, doc.__id])
          if (statusCode === 200) {
            if (action === DOWNLOAD_GRADES_AND_RESPONSE) {
              notificationMessage({
                title: 'Download Grades/Responses',
                message,
                showButton: true,
                buttonLink: downloadLink,
                buttonText: 'DOWNLOAD',
                notificationPosition: 'bottomRight',
                notificationKey: doc.__id,
                onCloseNotification: () => {
                  deleteNotificationDocument(doc.__id)
                },
                onButtonClick: (e) => {
                  onNotificationClick(e, doc.__id)
                },
              })
            } else
              antdNotification({ type: 'success', msg: message, key: doc.__id })
          } else {
            antdNotification({ msg: message, key: doc.__id })
          }

          if (statusCode !== 200) {
            // if status is initiated and we are displaying, delete the notification document from firebase
            deleteNotificationDocument(doc.__id)
          }
          setBulkActionStatus(false)
        }
      })
    }
  }, [bulkActionNotifications])

  return null
}

export default compose(
  connect(
    (state) => ({
      user: getUser(state),
    }),
    {
      removeClassSyncDetails: removeClassSyncNotificationAction,
      fetchStudentsById: fetchStudentsByIdAction,
      setGroupSyncData: setGroupSyncDataAction,
      fetchGroups: fetchGroupsAction,
      setSyncClassLoading: setSyncClassLoadingAction,
      setBulkActionStatus: setAssignmentBulkActionStatus,
    }
  )
)(ClassSyncNotificationListener)
