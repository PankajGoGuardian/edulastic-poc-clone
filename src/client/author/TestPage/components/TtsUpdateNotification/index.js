import { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { uniqBy } from 'lodash'
import qs from 'qs'
import antdNotification from '@edulastic/common/src/components/Notification'
import * as Fbs from '@edulastic/common/src/Firebase'
import { roleuser } from '@edulastic/constants'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { getUser, getUserOrgId } from '../../../src/selectors/user'
import { receiveAssignmentClassList } from '../../../src/actions/assignments'
import { destroyNotificationMessage } from '../../../../common/components/Notification'
// import { setAssignmentBulkActionStatus } from '../../ducks'
import { getFilterFromSession } from '../../../../common/utils/helpers'

const ttsUpdateNotificationCollection = 'TTSUpdateNotification'

const NotificationListener = ({
  user,
  location,
  fetchAssignmentClassList,
  // setBulkActionStatus,
  history,
  orgId,
}) => {
  const [notificationIds, setNotificationIds] = useState([])
  let districtId = ''
  let testId = ''
  const { termId = '', grades = [], assignedBy = '' } = getFilterFromSession({
    key: 'assignments_filter',
    userId: user._id,
    districtId: orgId,
  })
  const { testType = '' } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  })
  if (testType) {
    const locationArray = location?.pathname?.split('/') || []
    districtId = locationArray[locationArray?.length - 2] || ''
    testId = locationArray[locationArray?.length - 1] || ''
  }

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
        statusCode,
        successCount, // how many test has been process successfully
        totalCount, // how many total test should be processed
        status,
      } = doc

      if (status === 'initiated' && !notificationIds.includes(doc.__id)) {
        let _message = message

        // updating message based upon notification document for bulk update assignment settings
        if (collection === ttsUpdateNotificationCollection) {
          if (successCount === 0) {
            _message = `TTS failed for ${totalCount} assignments. Please try again.`
          } else {
            _message = `TTS updated for ${successCount} out of ${totalCount} assignments.`
          }
        }

        setNotificationIds([...notificationIds, doc.__id])
        if (statusCode === 200) {
          antdNotification({ type: 'success', msg: _message, key: doc.__id })
        } else {
          antdNotification({ msg: _message, key: doc.__id })
        }

        // if status is initiated and we are displaying, delete the notification document from firebase
        deleteNotificationDocument(doc.__id, collection)
        if (districtId && testId && testType) {
          fetchAssignmentClassList({
            districtId,
            testId,
            testType,
            termId,
            pageNo: 1,
            status: '',
            grades,
            assignedBy,
          })
        }

        // if user at assignments home page and bulk action has been processed successfully
        const isAssignmentsHomePage =
          !districtId &&
          !testId &&
          !testType &&
          location?.pathname?.includes('author/assignments') &&
          statusCode == 200

        if (isAssignmentsHomePage) {
          setTimeout(() => history.push('author/assignments'), 3000)
        }
        // setBulkActionStatus(false)
      }
    })
  }

  useEffect(() => {
    if (user && roleuser.DA_SA_ROLE_ARRAY.includes(user.role)) {
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
  connect(
    (state) => ({
      user: getUser(state),
      orgId: getUserOrgId(state),
    }),
    {
      fetchAssignmentClassList: receiveAssignmentClassList,
      // setBulkActionStatus: setAssignmentBulkActionStatus,
    }
  )
)(NotificationListener)
