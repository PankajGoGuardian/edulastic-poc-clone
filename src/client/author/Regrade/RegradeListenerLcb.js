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

import { reloadLcbDataInStudentViewAction } from '../src/actions/classBoard'

const collectionName = 'RegradeAssignments'

const NotificationListener = ({
  docId,
  onCloseModal,
  setFirestoreDocId,
  modalState,
  studentResponseData,
  reloadLcbDataInStudentView,
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
        const { assignmentId, groupId, lcbView } = modalState.itemData
        reloadLcbDataInStudentView({
          assignmentId,
          groupId,
          classId: groupId,
          testActivityId: studentResponseData?._id,
          studentId: studentResponseData?.userId,
          lcbView,
          modalState,
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
      modalState: getRegradeModalStateSelector(state),
      studentResponseData: get(state, 'studentResponse.data.testActivity', {}),
    }),
    {
      setEditEnable: setEditEnableAction,
      setFirestoreDocId: setRegradeFirestoreDocId,
      reloadLcbDataInStudentView: reloadLcbDataInStudentViewAction,
    }
  )
)(NotificationListener)
