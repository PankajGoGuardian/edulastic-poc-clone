import { useEffect } from 'react'
import { connect } from 'react-redux'
import { uniqBy, groupBy } from 'lodash'

import { FireBaseService as Fbs } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'

import { getUser } from '../../author/src/selectors/user'
import { actions } from '../uploadAnswerSheets/ducks'
import { bubbleSheetsCollectionName } from '../uploadAnswerSheets/utils'

const BubbleScanNotificationsListener = ({ user, setOmrSheetDocs }) => {
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
      [
        ...roleuser.DA_SA_ROLE_ARRAY,
        roleuser.TEACHER,
        roleuser.EDULASTIC_ADMIN,
      ].includes(user.role)
    ) {
      const uniqDocs = uniqBy(userNotifications, '__id')
      // TODO: find the current session's splitPDFDoc and use it to show notifications if failed
      // const splitPDFDocs = uniqDocs.filter((doc) => doc.action === 'SPLIT_PDF')
      const scannedDocs = uniqDocs.filter((doc) => doc.action !== 'SPLIT_PDF')
      // group docs by assignmentId
      const groupedDocs = groupBy(scannedDocs, 'assignmentId')
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
