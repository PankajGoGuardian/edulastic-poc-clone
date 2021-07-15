import { useEffect } from 'react'
import { connect } from 'react-redux'
import { uniqBy, groupBy } from 'lodash'

import { FireBaseService as Fbs } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'

import { getUser } from '../../author/src/selectors/user'
import { actions } from '../uploadAnswerSheets/ducks'

const bubbleSheetsCollectionName = 'BubbleAnswerSheets'

const BubbleScanNotificationsListener = ({ user, setOmrSheetDocs }) => {
  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(bubbleSheetsCollectionName)
        .where('uploadedBy._id', '==', `${user?._id}`),
    [user?._id]
  )

  // uncomment to perform deletion (dev only)
  // const deleteNotificationDocument = (docId) => {
  //   Fbs.db
  //     .collection(bubbleSheetsCollectionName)
  //     .doc(docId)
  //     .delete()
  //     .catch((err) => console.error(err))
  // }

  useEffect(() => {
    if (
      user &&
      [...roleuser.DA_SA_ROLE_ARRAY, roleuser.TEACHER].includes(user.role)
    ) {
      const uniqDocs = uniqBy(userNotifications, '__id')
      // group docs by assignmentId
      const groupedDocs = groupBy(uniqDocs, 'assignmentId')
      // created nested groups by sessionId
      Object.keys(groupedDocs).forEach((aId) => {
        groupedDocs[aId] = groupBy(groupedDocs[aId], 'sessionId')
      })
      setOmrSheetDocs(groupedDocs)
    }
  }, [userNotifications])

  return null
}

export default connect(
  (state) => ({
    user: getUser(state),
  }),
  {
    setOmrSheetDocs: actions.setOmrSheetDocsAction,
  }
)(BubbleScanNotificationsListener)
