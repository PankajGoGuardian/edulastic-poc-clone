import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { uniqBy } from 'lodash'

import { FireBaseService as Fbs } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { themeColor } from '@edulastic/colors'

import ReportsNotificationModal from './ReportsNotificationModal'

import { styledNotification } from '../../common/styled'

import { getUser } from '../../../src/selectors/user'
import {
  getCsvModalVisible,
  setCsvModalVisibleAction,
  getCsvDocs,
  setCsvDocsAction,
  setGenerateCSVStatusAction,
} from '../../ducks'

const reportCSVCollectionName = 'ReportCSV'

const ReportsNotificationListener = ({
  user,
  setGenerateCSVStatus,
  reportDocs,
  setReportDocs,
  visible,
  setVisible,
}) => {
  const [notificationIds, setNotificationIds] = useState([])
  const [isNotificationVisible, setIsNotificationVisible] = useState(false)
  const [isNotificationClicked, setIsNotificationClicked] = useState(false)

  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(reportCSVCollectionName)
        .where('userId', '==', `${user?._id}`),
    [user?._id]
  )

  const updateNotificationDocuments = (docs = [], updateData = {}) => {
    const batch = Fbs.db.batch()
    docs.forEach((d) => {
      const ref = Fbs.db.collection(reportCSVCollectionName).doc(d.__id)
      batch.update(ref, updateData)
    })
    batch.commit().catch((err) => console.error(err))
  }

  const deleteNotificationDocument = (docId) => {
    Fbs.db
      .collection(reportCSVCollectionName)
      .doc(docId)
      .delete()
      .catch((err) => console.error(err))
  }

  const showUserNotifications = (docs) => {
    let notificationProps = null
    uniqBy(docs, '__id').forEach((doc) => {
      const { status, processStatus, message, statusCode, modifiedAt } = doc
      const daysDiff = (Date.now() - modifiedAt) / (24 * 60 * 60 * 1000)
      if (daysDiff > 15) {
        // delete documents older than 15 days
        // this serves as fallback, timed deletion is handled in db rules
        deleteNotificationDocument(doc.__id)
      } else if (
        status === 'initiated' &&
        processStatus === 'done' &&
        !notificationIds.includes(doc.__id)
      ) {
        setNotificationIds([...notificationIds, doc.__id])
        if (statusCode === 200) {
          const _message = (
            <>
              {message}
              <span
                style={{ color: themeColor, cursor: 'pointer' }}
                onClick={() => {
                  setVisible(true)
                  setIsNotificationClicked(true)
                }}
              >
                {' Click here to download. '}
              </span>
            </>
          )
          notificationProps = {
            type: 'success',
            msg: _message,
            duration: 10,
          }
        } else {
          // delete document if the csv generation failed
          styledNotification({ type: 'error', msg: message })
          deleteNotificationDocument(doc.__id)
        }
        setGenerateCSVStatus(false)
      }
    })
    if (notificationProps && !isNotificationVisible) {
      setIsNotificationVisible(true)
      styledNotification({
        ...notificationProps,
        onClose: () => setIsNotificationVisible(false),
      })
    }
  }

  useEffect(() => {
    if (
      user &&
      [...roleuser.DA_SA_ROLE_ARRAY, roleuser.TEACHER].includes(user.role)
    ) {
      const _reportDocs = uniqBy(
        userNotifications.filter((d) => d.downloadLink),
        '__id'
      )
      setReportDocs(_reportDocs)
      showUserNotifications(userNotifications)
    }
  }, [userNotifications])

  useEffect(() => {
    if (isNotificationClicked) {
      const docsToUpdate = reportDocs.filter(
        (d) => d.status === 'initiated' && d.processStatus === 'done'
      )
      // bulk update docs for which the notification has been clicked
      updateNotificationDocuments(docsToUpdate, { status: 'completed' })
      setIsNotificationClicked(false)
    }
  }, [isNotificationClicked])

  return (
    <ReportsNotificationModal
      visible={visible}
      reportDocs={reportDocs}
      onClose={() => setVisible(false)}
    />
  )
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      user: getUser(state),
      visible: getCsvModalVisible(state),
      reportDocs: getCsvDocs(state),
    }),
    {
      setGenerateCSVStatus: setGenerateCSVStatusAction,
      setVisible: setCsvModalVisibleAction,
      setReportDocs: setCsvDocsAction,
    }
  )
)(ReportsNotificationListener)
