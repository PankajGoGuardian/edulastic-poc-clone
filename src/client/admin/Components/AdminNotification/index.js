import { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { uniqBy } from 'lodash'
import * as Fbs from '@edulastic/common/src/Firebase'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { EDULASTIC_ADMIN } from '@edulastic/constants/const/roleType'
import notification from '@edulastic/common/src/components/Notification'
import { getUserId, getUserRole } from '../../../student/Login/ducks'
import { destroyNotificationMessage } from '../../../common/components/Notification'
import {
  getUserIdSelector,
  getUserSelector,
} from '../../../author/src/selectors/user'
import { saveGenerateMappingDateAction } from '../../MergeSyncTable/ducks'

const collectionName = 'lmsMappingStatus'

const AdminNotificationListener = ({
  userRole,
  userId,
  saveGeneratedMappingDate,
}) => {
  const [notificationIds, setNotificationIds] = useState([])
  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) => db.collection(collectionName).where('userId', '==', `${userId}`),
    [userId]
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
      const { status, modifiedAt, message, entityType } = doc
      if (!notificationIds.includes(doc.__id)) {
        if (status === 'completed') {
          notification({ type: 'success', msg: message })
          saveGeneratedMappingDate({ modifiedAt, type: entityType })
          setNotificationIds([...notificationIds, doc.__id])
          deleteNotificationDocument(doc.__id, collectionName)
        } else if (status === 'failed') {
          notification({ type: 'error', msg: message })
          setNotificationIds([...notificationIds, doc.__id])
          deleteNotificationDocument(doc.__id, collectionName)
        }
      }
    })
  }

  useEffect(() => {
    if (userRole === EDULASTIC_ADMIN) {
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
      userRole: getUserRole(state),
      userId: getUserIdSelector(state),
    }),
    {
      saveGeneratedMappingDate: saveGenerateMappingDateAction,
    }
  )
)(AdminNotificationListener)
