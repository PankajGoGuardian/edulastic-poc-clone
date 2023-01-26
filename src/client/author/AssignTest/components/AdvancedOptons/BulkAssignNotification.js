import { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { uniqBy } from 'lodash'
import { notification as antdNotification } from '@edulastic/common'
import * as Fbs from '@edulastic/common/src/Firebase'
import { roleuser } from '@edulastic/constants'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { getUser, getUserOrgId } from '../../../src/selectors/user'
import { destroyNotificationMessage } from '../../../../common/components/Notification'

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
      const { status, statusCode } = doc
      if (status === 'done' && !notificationIds.includes(doc.__id)) {
        setNotificationIds([...notificationIds, doc.__id])
        if (statusCode === 200) {
          antdNotification({
            type: 'success',
            msg: 'Bulk Assign successfull',
            key: doc.__id,
          })
        } else {
          antdNotification({ msg: 'Bulk assign failed', key: doc.__id })
        }
        deleteNotificationDocument(doc.__id)
      }
    })
  }

  useEffect(() => {
    if (user && roleuser.DA_SA_ROLE_ARRAY.includes(user.role)) {
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
