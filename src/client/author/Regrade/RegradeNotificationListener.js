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
  getShowRegradeConfirmPopupSelector,
  getShowUpgradePopupSelector,
  resetUpdatedStateAction,
  setEditEnableAction,
  setRegradeFirestoreDocId,
  setRegradingStateAction,
  setShowRegradeConfirmPopupAction,
  setShowUpgradePopupAction,
  setTestDataAction,
  setTestsLoadingAction,
} from '../TestPage/ducks'

const collectionName = 'RegradeAssignments'

const NotificationListener = ({
  docId,
  history,
  setEditEnable,
  setFirestoreDocId,
  setRegradingState,
  showRegradeConfirmPopup,
  setTestsLoading,
  setShowRegradeConfirmPopup,
  setTestData,
  resetUpdatedState,
  setShowUpgradePopup,
  showUpgradePopup,
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

  const resetRegradingState = () => {
    deleteNotificationDocument()
    setEditEnable(false)
    setRegradingState(false)
    setShowUpgradePopup(false)
  }

  useEffect(() => {
    if (userNotification) {
      const { error, processStatus, newTestId } = userNotification
      if (processStatus === 'DONE' && !error) {
        if (showRegradeConfirmPopup) {
          antdNotification({
            type: 'success',
            msg: 'Assignment regrade is successful',
          })
        }
        if (showUpgradePopup) {
          antdNotification({
            type: 'success',
            msg:
              'Test has been upgraded to the latest version and changes have been applied to the assignment.',
          })
        }
        if (!showUpgradePopup && !showRegradeConfirmPopup) {
          antdNotification({
            type: 'success',
            msg: 'Test published successfully',
          })
        }
        resetRegradingState()
        if (showRegradeConfirmPopup) {
          return history.push(`/author/regrade/${newTestId}/success`)
        }
        setTestData({ status: 'published' })
        resetUpdatedState()
        setTestsLoading(false)
        return history.push(`/author/tests/tab/review/id/${newTestId}`)
      }
      if (error) {
        antdNotification({ type: 'error', msg: error })
        resetRegradingState()
      }
    }
  }, [userNotification])

  useEffect(() => {
    return () => {
      setFirestoreDocId('')
      setRegradingState(false)
      setShowRegradeConfirmPopup(false)
    }
  }, [])

  return null
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      docId: getRegradeFirebaseDocIdSelector(state),
      showRegradeConfirmPopup: getShowRegradeConfirmPopupSelector(state),
      showUpgradePopup: getShowUpgradePopupSelector(state),
    }),
    {
      setEditEnable: setEditEnableAction,
      setFirestoreDocId: setRegradeFirestoreDocId,
      setRegradingState: setRegradingStateAction,
      setTestsLoading: setTestsLoadingAction,
      setShowRegradeConfirmPopup: setShowRegradeConfirmPopupAction,
      setShowUpgradePopup: setShowUpgradePopupAction,
      setTestData: setTestDataAction,
      resetUpdatedState: resetUpdatedStateAction,
    }
  )
)(NotificationListener)
