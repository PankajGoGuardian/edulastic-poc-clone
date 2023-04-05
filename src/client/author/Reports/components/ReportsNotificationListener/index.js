import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { uniqBy } from 'lodash'

import { Spin } from 'antd'
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
  getCsvDocsLoading,
  updateCsvDocsAction,
  setHasCsvDocsAction,
} from '../../ducks'
import {
  closeHangoutNotification as closeFirebaseNotification,
  notificationMessage,
} from '../../../../common/components/Notification'
import { setAssignmentBulkActionStatus } from '../../../AssignmentAdvanced/ducks'

const reportCSVCollectionName = 'ReportCSV'
const DOWNLOAD_GRADES_AND_RESPONSE = 'DOWNLOAD_GRADES_AND_RESPONSE'
const REPORT_NOTIFICATION_STATUS = {
  INITIATED: 'initiated',
  COMPLETED: 'completed',
  DONE: 'done',
}

const ReportsNotificationListener = ({
  user,
  csvDocs,
  csvDocsLoading,
  setHasCsvDocs,
  updateCsvDocs,
  visible,
  setVisible,
  setBulkActionStatus,
}) => {
  const [notificationIds, setNotificationIds] = useState([])
  const [isNotificationVisible, setIsNotificationVisible] = useState(false)
  const [isNotificationClicked, setIsNotificationClicked] = useState(false)

  const updateCallback = useCallback(
    () => updateCsvDocs({ csvModalVisible: true }),
    []
  )

  const userNotifications = Fbs.useFirestoreRealtimeDocuments(
    (db) =>
      db
        .collection(reportCSVCollectionName)
        .where('userId', '==', `${user?._id}`),
    [user?._id]
  )

  const updateNotificationDocuments = (
    docs = [],
    updateData = {},
    callback = () => {}
  ) => {
    const batch = Fbs.db.batch()
    docs.forEach((d) => {
      const ref = Fbs.db.collection(reportCSVCollectionName).doc(d.__id)
      batch.update(ref, updateData)
    })
    batch
      .commit()
      .then(callback)
      .catch((err) => console.error(err))
  }

  const deleteNotificationDocument = (docId, callback = () => {}) => {
    Fbs.db
      .collection(reportCSVCollectionName)
      .doc(docId)
      .delete()
      .then(callback)
      .catch((err) => console.error(err))
  }

  const onNotificationClick = (e, docId) => {
    /**
     * Note: As this function gets invoked on clicking anywhere in the notification.
     * So making sure that the user clicked on Download button in the notification by
     * and only than the notification document is getting deleted.
     */
    if (e?.target?.tagName.toLowerCase() === 'a') {
      closeFirebaseNotification(docId)
      deleteNotificationDocument(docId)
    }
  }

  const showUserNotifications = (docs) => {
    let notificationProps = null
    uniqBy(docs, '__id').forEach((doc) => {
      const {
        status,
        processStatus,
        message,
        statusCode,
        modifiedAt,
        reportType,
        downloadLinkStatus,
        downloadLink,
      } = doc
      const isBulkDownload = reportType === DOWNLOAD_GRADES_AND_RESPONSE

      const daysDiff = (Date.now() - modifiedAt) / (24 * 60 * 60 * 1000)
      if (daysDiff > 15 && !isBulkDownload) {
        // delete documents older than 15 days
        deleteNotificationDocument(doc.__id)
      } else if (
        status === REPORT_NOTIFICATION_STATUS.INITIATED &&
        (processStatus === REPORT_NOTIFICATION_STATUS.DONE ||
          downloadLinkStatus === REPORT_NOTIFICATION_STATUS.DONE) &&
        !notificationIds.includes(doc.__id)
      ) {
        setNotificationIds([...notificationIds, doc.__id])
        if (statusCode === 200) {
          if (isBulkDownload) {
            notificationMessage({
              title: 'Download Grades/Responses',
              message,
              showButton: true,
              buttonLink: downloadLink,
              buttonText: 'DOWNLOAD',
              notificationPosition: 'bottomRight',
              notificationKey: doc.__id,
              onCloseNotification: () => {
                deleteNotificationDocument(doc.__id)
              },
              onButtonClick: (e) => {
                onNotificationClick(e, doc.__id)
              },
            })
          } else {
            const _message = (
              <>
                {message}
                <span
                  data-cy="download-csv-notification"
                  style={{ color: themeColor, cursor: 'pointer' }}
                  onClick={() => setIsNotificationClicked(true)}
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
          }
        } else {
          // delete document if the csv generation failed
          styledNotification({ type: 'error', msg: message })
          deleteNotificationDocument(doc.__id)
        }
      }
      if (isBulkDownload) {
        setBulkActionStatus(false)
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
      const filteredUserNotifications = userNotifications.filter(
        (d) => d.downloadLink && d.reportType !== DOWNLOAD_GRADES_AND_RESPONSE
      )
      setHasCsvDocs(!!filteredUserNotifications.length)
      if (
        userNotifications.some(
          (d) =>
            d.status === REPORT_NOTIFICATION_STATUS.INITIATED &&
            (d.processStatus === REPORT_NOTIFICATION_STATUS.DONE ||
              d.downloadLinkStatus === REPORT_NOTIFICATION_STATUS.DONE) &&
            d.downloadLink
        )
      )
        showUserNotifications(userNotifications)
    }
  }, [userNotifications])

  useEffect(() => {
    if (isNotificationClicked) {
      const docsToUpdate = userNotifications.filter(
        (d) =>
          d.status === REPORT_NOTIFICATION_STATUS.INITIATED &&
          d.processStatus === REPORT_NOTIFICATION_STATUS.DONE &&
          d.downloadLink
      )
      // bulk update docs for which the notification has been clicked
      updateNotificationDocuments(
        docsToUpdate,
        { status: REPORT_NOTIFICATION_STATUS.COMPLETED },
        updateCallback
      )
      setIsNotificationClicked(false)
    }
  }, [isNotificationClicked])

  return (
    <>
      {csvDocsLoading ? <Spin size="large" /> : null}
      <ReportsNotificationModal
        visible={visible}
        reportDocs={csvDocs}
        onClose={() => setVisible(false)}
        // NOTE: uncomment for dev purpose, do not delete
        // deleteDoc={(docId) => deleteNotificationDocument(docId, updateCallback)}
      />
    </>
  )
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      user: getUser(state),
      visible: getCsvModalVisible(state),
      csvDocs: getCsvDocs(state),
      csvDocsLoading: getCsvDocsLoading(state),
    }),
    {
      setHasCsvDocs: setHasCsvDocsAction,
      updateCsvDocs: updateCsvDocsAction,
      setVisible: setCsvModalVisibleAction,
      setBulkActionStatus: setAssignmentBulkActionStatus,
    }
  )
)(ReportsNotificationListener)
