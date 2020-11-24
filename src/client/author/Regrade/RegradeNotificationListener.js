import { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import {
  FireBaseService as Fbs,
  notification as antdNotification,
} from '@edulastic/common'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  getRegradeFirebaseDocIdSelector,
  setEditEnableAction,
  setRegradeFirestoreDocId,
} from '../TestPage/ducks'

const collectionName = 'RegradeAssignments'

const NotificationListener = ({
  docId,
  history,
  setEditEnable,
  setFirestoreDocId,
}) => {
  const userNotification = Fbs.useFirestoreRealtimeDocument(
    (db) => db.collection(collectionName).doc(docId),
    [docId]
  )

  const deleteNotificationDocument = () => {
    Fbs.db
      .collection(collectionName)
      .doc(docId)
      .delete()
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    if (userNotification) {
      const { error, processStatus, newTestId } = userNotification
      if (processStatus === 'DONE' && !error) {
        antdNotification({ type: 'success', messageKey: 'successUpdate' })
        setEditEnable(false)
        deleteNotificationDocument()
        history.push(`/author/regrade/${newTestId}/success`)
      } else if (error) {
        antdNotification({ type: 'error', msg: error })
        deleteNotificationDocument()
        setEditEnable(false)
      }
    }
  }, [userNotification])

  useEffect(() => {
    return () => {
      setFirestoreDocId('')
    }
  }, [])

  return null
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      docId: getRegradeFirebaseDocIdSelector(state),
    }),
    {
      setEditEnable: setEditEnableAction,
      setFirestoreDocId: setRegradeFirestoreDocId,
    }
  )
)(NotificationListener)
