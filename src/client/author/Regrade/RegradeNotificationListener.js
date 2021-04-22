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
  setRegradingStateAction,
} from '../TestPage/ducks'

const collectionName = 'RegradeAssignments'

const NotificationListener = ({
  docId,
  history,
  noRedirect,
  onCloseModal,
  setEditEnable,
  setFirestoreDocId,
  setRegradingState,
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
        antdNotification({
          type: 'success',
          msg: 'Assignment regrade is successful',
        })
        setEditEnable(false)
        setRegradingState(false)
        deleteNotificationDocument()
        if (!noRedirect) {
          history.push(`/author/regrade/${newTestId}/success`)
        }
        if (typeof onCloseModal === 'function') {
          onCloseModal()
        }
      } else if (error) {
        antdNotification({ type: 'error', msg: error })
        deleteNotificationDocument()
        setEditEnable(false)
        setRegradingState(false)
        if (typeof onCloseModal === 'function') {
          onCloseModal()
        }
      }
    }
  }, [userNotification])

  useEffect(() => {
    return () => {
      setFirestoreDocId('')
      setRegradingState(false)
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
      setRegradingState: setRegradingStateAction,
    }
  )
)(NotificationListener)
