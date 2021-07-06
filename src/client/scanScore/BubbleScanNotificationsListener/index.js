import { useEffect } from 'react'
import { connect } from 'react-redux'
import { uniqBy, groupBy } from 'lodash'

import { FireBaseService as Fbs } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'

import { getUser } from '../../author/src/selectors/user'
import { setGroupedDocsAction } from '../ducks'

const bubbleSheetsCollectionName = 'BubbleAnswerSheets'

const BubbleScanNotificationsListener = ({ user, setGroupedDocs }) => {
  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(bubbleSheetsCollectionName)
        .where('uploadedBy._id', '==', `${user?._id}`),
    [user?._id]
  )

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
      setGroupedDocs(groupedDocs)
    }
  }, [userNotifications])

  return null
}

export default connect(
  (state) => ({
    user: getUser(state),
  }),
  {
    setGroupedDocs: setGroupedDocsAction,
  }
)(BubbleScanNotificationsListener)
