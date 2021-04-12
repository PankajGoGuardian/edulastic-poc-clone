import { useEffect } from 'react'
import {
  FireBaseService as Fbs,
  notification as antdNotification,
} from '@edulastic/common'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'
import {
  getRegradeFirebaseDocIdSelector,
  getRegradeModalStateSelector,
  setEditEnableAction,
  setRegradeFirestoreDocId,
} from '../TestPage/ducks'
import { correctItemUpdateAction } from '../ClassBoard/ducks'
import { markQuestionLabel } from '../ClassBoard/Transformer'
import { receiveTestActivitydAction } from '../src/actions/classBoard'

const collectionName = 'RegradeAssignments'

const NotificationListener = ({
  docId,
  onCloseModal,
  setFirestoreDocId,
  correctItemUpdate,
  testItems,
  modalState,
  loadTestActivity,
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
      const { error, processStatus } = userNotification
      if (processStatus === 'DONE' && !error) {
        const itemsToReplace = testItems.map((t) =>
          t.id === modalState.itemData.testItemId ? modalState.item : t
        )
        markQuestionLabel(itemsToReplace)
        correctItemUpdate(itemsToReplace)
        const {
          assignmentId,
          groupId,
          studentId,
          testActivityId,
        } = modalState.itemData
        loadTestActivity(assignmentId, groupId, false, {
          studentId,
          testActivityId,
        })
        antdNotification({
          type: 'success',
          msg: 'Assignment regrade is successful',
        })

        if (typeof onCloseModal === 'function') {
          onCloseModal()
        }
      } else if (error) {
        antdNotification({ type: 'error', msg: error })
        deleteNotificationDocument()
        if (typeof onCloseModal === 'function') {
          onCloseModal()
        }
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
  connect(
    (state) => ({
      docId: getRegradeFirebaseDocIdSelector(state),
      testItems: get(state, 'classResponse.data.testItems', []),
      modalState: getRegradeModalStateSelector(state),
    }),
    {
      setEditEnable: setEditEnableAction,
      setFirestoreDocId: setRegradeFirestoreDocId,
      correctItemUpdate: correctItemUpdateAction,
      loadTestActivity: receiveTestActivitydAction,
    }
  )
)(NotificationListener)
