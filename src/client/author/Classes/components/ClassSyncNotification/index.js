import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as Fbs from '@edulastic/common/src/Firebase'
import { roleuser } from '@edulastic/constants'
import { uniqBy, pull, isEmpty, capitalize, uniq } from 'lodash'
import notification from '@edulastic/common/src/components/Notification'
import { destroyNotificationMessage } from '../../../../common/components/Notification'
import { getUser } from '../../../src/selectors/user'
import {
  canvasSyncFireBaseStatus,
  canvasSyncStatus,
} from '../../../ManageClass/constants'
import {
  fetchStudentsByIdAction,
  removeClassSyncNotificationAction,
  setGroupSyncDataAction,
  setSyncClassLoadingAction,
  getClassSyncLoadingStatus,
} from '../../../ManageClass/ducks'
import { fetchGroupsAction } from '../../../sharedDucks/groups'
import { setAssignmentBulkActionStatus } from '../../../AssignmentAdvanced/ducks'
import { setBulkSyncCanvasStateAction } from '../../../../student/Signup/duck'
import { withRouter } from 'react-router-dom'

const antdNotification = notification
const firestoreGoogleClassSyncStatusCollection = 'GoogleClassSyncStatus'
const firestoreGoogleGradesSyncStatusCollection = 'GoogleGradeSyncStatus'
const firestoreCleverGradesSyncStatusCollection = 'CleverGradeSyncStatus'
const firestoreCanvasClassSyncStatusCollection = 'CanvasClassSyncStatus'
const firestoreAtlasClassSyncStatusCollection = 'AtlasClassSyncStatus'

const firestoreBulkActionCollection = 'AssignmentBulkActionEvents'
const DOWNLOAD_GRADES_AND_RESPONSE = 'DOWNLOAD_GRADES_AND_RESPONSE'
const ClassSyncNotificationListener = ({
  user,
  removeClassSyncDetails,
  fetchStudentsById,
  setSyncClassLoading,
  getClassSyncLoading,
  setGroupSyncData,
  fetchGroups,
  setBulkActionStatus,
  setCanvasBulkSyncStatus,
  history,
}) => {
  const [notificationIds, setNotificationIds] = useState([])
  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(firestoreGoogleClassSyncStatusCollection)
        .where('userId', '==', `${user?._id}`),
    [user?._id]
  )

  const canvasBulkSyncNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(firestoreCanvasClassSyncStatusCollection)
        .where('userId', '==', `${user?._id}`),
    [user?._id]
  )

  const atlasClassSyncNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(firestoreAtlasClassSyncStatusCollection)
        .where('userId', '==', `${user?._id}`),
    [user?._id]
  )

  const gradesSyncNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(firestoreGoogleGradesSyncStatusCollection)
        .where('userId', '==', `${user?._id}`),
    [user?._id]
  )

  const cleverGradesSyncNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(firestoreCleverGradesSyncStatusCollection)
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

  const deleteNotificationDocument = (docId, collectionName) => {
    Fbs.db
      .collection(collectionName)
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
      const pathName = window.location.pathname
      if (/manageClass\/([a-f0-9])\w*/g.test(pathName)) {
        history.push(`/author/manageClass/${groupId}`)
      }
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
      const {
        status,
        studentsSaved,
        counter,
        groupId,
        message,
        multipleDistrictUserEmail,
      } = doc
      // should not append `Please try again later, or email support@edulastic.com.`
      const exact = message?.includes('No google class found')
      if (
        (status === 'completed' || counter === 0) &&
        !notificationIds.includes(doc.__id)
      ) {
        setNotificationIds([...notificationIds, doc.__id])
        let teacherNotEnrolled = ''
        if (multipleDistrictUserEmail?.length) {
          teacherNotEnrolled = `${uniq(
            multipleDistrictUserEmail
          )} can't be enrolled to class as they are part of another district.`
        }
        // show sync complete notification
        notification({
          msg: `${
            message || 'Class sync task completed.'
          } ${teacherNotEnrolled}`,
          type: message ? 'error' : 'success',
          exact,
          onClose: () => {
            closeNotification(event, doc.__id, { groupId, studentsSaved })
          },
        })
      }
    })
  }

  const showUserNotificationOnCanvasBulkSync = (docs) => {
    uniqBy(docs, '__id').map((doc) => {
      const { status, message, multipleDistrictUserEmail } = doc
      if (
        status === canvasSyncFireBaseStatus.INPROGRESS &&
        !notificationIds.includes(doc.__id)
      ) {
        setCanvasBulkSyncStatus(canvasSyncStatus.INPROGRESS)
      }
      if (
        status === canvasSyncFireBaseStatus.COMPLETED &&
        !notificationIds.includes(doc.__id)
      ) {
        setCanvasBulkSyncStatus(canvasSyncStatus.SUCCESS)
        sessionStorage.removeItem('signupFlow')
        setNotificationIds([...notificationIds, doc.__id])
        let teacherNotEnrolled = ''
        if (multipleDistrictUserEmail?.length) {
          teacherNotEnrolled = `${uniq(
            multipleDistrictUserEmail
          )} can't be enrolled to class as they are part of another district.`
        }
        // show sync complete notification
        notification({
          msg: `${
            message || 'Canvas Class sync task completed.'
          } ${teacherNotEnrolled}`,
          type: 'success',
          onClose: () => {
            deleteNotificationDocument(
              doc.__id,
              firestoreCanvasClassSyncStatusCollection
            )
          },
        })
      }
      if (status === canvasSyncFireBaseStatus.FAILED) {
        setCanvasBulkSyncStatus(canvasSyncStatus.FAILED)
        notification({
          messageKey: 'bulkSyncFailed',
          msg: message,
          type: 'error',
        })
      }
    })
  }

  const showUserNotificationOnAtlasClassSync = (docs) => {
    uniqBy(docs, '__id').map((doc) => {
      const {
        status,
        message,
        counter,
        groupIds,
        multipleDistrictUserEmail,
      } = doc
      const districtWithAtlasProviderName = user?.orgData?.districts?.find(
        (o) => !isEmpty(o?.atlasProviderName)
      )
      const providerName =
        districtWithAtlasProviderName?.atlasProviderName || 'Atlas'

      if (
        status === 'completed' &&
        counter === 0 &&
        !notificationIds.includes(doc.__id)
      ) {
        setNotificationIds([...notificationIds, doc.__id])
        let teacherNotEnrolled = ''
        if (multipleDistrictUserEmail?.length) {
          teacherNotEnrolled = `${uniq(
            multipleDistrictUserEmail
          )} can't be enrolled to class as they are part of another district.`
        }
        // show sync complete notification
        notification({
          msg: `${
            message || `${capitalize(providerName)} class sync task completed.`
          } ${teacherNotEnrolled}`,
          type: 'success',
          onClose: () => {
            setNotificationIds([...pull(notificationIds, [doc.__id])])
            deleteNotificationDocument(
              doc.__id,
              firestoreAtlasClassSyncStatusCollection
            )
          },
        })

        if (getClassSyncLoading) {
          fetchStudentsById({ classId: groupIds?.[0] })
          setSyncClassLoading(false)
        }
        fetchGroups()
      }
      if (
        status === 'failed' &&
        counter === 0 &&
        !notificationIds.includes(doc.__id)
      ) {
        setNotificationIds([...notificationIds, doc.__id])
        notification({
          msg: `Class sync with ${capitalize(providerName)} failed`,
          type: 'error',
          onClose: () => {
            setNotificationIds([...pull(notificationIds, [doc.__id])])
            deleteNotificationDocument(
              doc.__id,
              firestoreAtlasClassSyncStatusCollection
            )
          },
        })
        setSyncClassLoading(false)
      }
      if (isEmpty(districtWithAtlasProviderName)) {
        deleteNotificationDocument(
          doc.__id,
          firestoreAtlasClassSyncStatusCollection
        )
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
    if (user && user.role === roleuser.TEACHER) {
      showUserNotifications(userNotifications)
    }
  }, [userNotifications])

  useEffect(() => {
    if (user && user.role === roleuser.TEACHER) {
      showUserNotificationOnCanvasBulkSync(canvasBulkSyncNotifications)
    }
  }, [canvasBulkSyncNotifications])

  useEffect(() => {
    if (user && user.role === roleuser.TEACHER) {
      showUserNotificationOnAtlasClassSync(atlasClassSyncNotifications)
    }
  }, [atlasClassSyncNotifications])

  useEffect(() => {
    uniqBy(gradesSyncNotifications, '__id').forEach((doc) => {
      const { status, message, success = false } = doc
      if (status === 'completed' && !notificationIds.includes(doc.__id)) {
        notification({ type: success ? 'success' : 'error', msg: message })
        setNotificationIds([...notificationIds, doc.__id])
        deleteNotificationDocument(
          doc.__id,
          firestoreGoogleGradesSyncStatusCollection
        )
      }
    })
  }, [gradesSyncNotifications])

  useEffect(() => {
    uniqBy(cleverGradesSyncNotifications, '__id').forEach((doc) => {
      const { status, message, success = false } = doc
      if (status === 'completed' && !notificationIds.includes(doc.__id)) {
        notification({ type: success ? 'success' : 'error', msg: message })
        setNotificationIds([...notificationIds, doc.__id])
        deleteNotificationDocument(
          doc.__id,
          firestoreCleverGradesSyncStatusCollection
        )
      }
    })
  }, [cleverGradesSyncNotifications])

  useEffect(() => {
    if (user && user.role === roleuser.TEACHER) {
      uniqBy(bulkActionNotifications, '__id').map((doc) => {
        const { status, processStatus, message, isBulkAction, statusCode } = doc
        if (
          isBulkAction &&
          status === 'initiated' &&
          processStatus === 'done' &&
          !notificationIds.includes(doc.__id)
        ) {
          setNotificationIds([...notificationIds, doc.__id])
          if (statusCode === 200) {
            antdNotification({ type: 'success', msg: message, key: doc.__id })
          } else {
            antdNotification({ msg: message, key: doc.__id })
          }

          if (statusCode !== 200) {
            // if status is initiated and we are displaying, delete the notification document from firebase
            deleteNotificationDocument(doc.__id, firestoreBulkActionCollection)
          }
          setBulkActionStatus(false)
        }
      })
    }
  }, [bulkActionNotifications])

  return null
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      user: getUser(state),
      getClassSyncLoading: getClassSyncLoadingStatus(state),
    }),
    {
      removeClassSyncDetails: removeClassSyncNotificationAction,
      fetchStudentsById: fetchStudentsByIdAction,
      setGroupSyncData: setGroupSyncDataAction,
      fetchGroups: fetchGroupsAction,
      setSyncClassLoading: setSyncClassLoadingAction,
      setBulkActionStatus: setAssignmentBulkActionStatus,
      setCanvasBulkSyncStatus: setBulkSyncCanvasStateAction,
    }
  )
)(ClassSyncNotificationListener)
