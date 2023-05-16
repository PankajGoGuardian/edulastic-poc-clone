import React, { useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import qs from 'qs'

import PageLayout from './PageLayout'
import SessionsPage from './SessionsPage'
import SessionPage from './SessionPage'
import UploadPage from './UploadPage'

import {
  omrSheetScanStatus,
  omrUploadSessionStatus,
  processStatusMapping,
} from './utils'
import { actions, selector } from './ducks'

const UploadAnswerSheets = ({
  history,
  location,
  uploading,
  uploadProgress,
  uploadRunner,
  cancelUpload,
  loading,
  omrUploadSessions,
  currentSession,
  omrSheetDocs,
  setCancelUpload,
  handleUploadProgress,
  getOmrUploadSessions,
  setOmrUploadSession,
  createOmrUploadSession,
  updateOmrUploadSession,
  abortOmrUploadSession,
  showSessions,
  responsePageNumber,
  setResponsePageNumber,
  assignmentTitle,
  classTitle,
}) => {
  const {
    assignmentId = '',
    groupId = '',
    sessionId = '',
    fromWebcam,
  } = useMemo(
    () => qs.parse(location?.search || '', { ignoreQueryPrefix: true }),
    [location?.search]
  )

  const showResponses = useMemo(() => !!responsePageNumber, [
    responsePageNumber,
  ])

  const { pageDocs, scanInProgress } = useMemo(() => {
    const _pageDocs = (omrSheetDocs?.[assignmentId]?.[sessionId] || []).map(
      (d) => ({
        docId: d.__id,
        _id: d.sessionId,
        uri: d.uri,
        sessionId: d.sessionId,
        assignmentId: d.assignmentId,
        scannedUri: d.scannedUri,
        studentId: d.studentId,
        studentName: d.studentName,
        status: processStatusMapping[d.processStatus],
        message: d.message,
      })
    )
    const _scanInProgress = !_pageDocs.every(
      (p) => p?.status > omrSheetScanStatus.SCANNING
    )
    return { pageDocs: _pageDocs, scanInProgress: _scanInProgress }
  }, [omrSheetDocs, assignmentId, sessionId])

  const breadcrumbData = useMemo(() => {
    const breadcrumbs = [
      { title: 'Scan Bubble Sheet', onClick: () => setResponsePageNumber(0) },
    ]
    if (assignmentId && groupId) {
      breadcrumbs[0].to = `uploadAnswerSheets?assignmentId=${assignmentId}&groupId=${groupId}`
    }
    if (assignmentId && groupId && sessionId) {
      breadcrumbs.push({
        title: 'Scan Summary',
        to: `uploadAnswerSheets?assignmentId=${assignmentId}&groupId=${groupId}&sessionId=${sessionId}`,
        onClick: () => setResponsePageNumber(0),
      })
    }
    if (showResponses) {
      breadcrumbs.push({ title: 'Scan Result' })
    }
    return breadcrumbs
  }, [assignmentId, groupId, sessionId, showResponses])

  // NOTE: handles click on listed sessions
  const handleSessionClick = useCallback((_sessionId) => {
    const session = omrUploadSessions.find((s) => s._id === _sessionId)
    setOmrUploadSession({ session })
    history.push({
      pathname: '/uploadAnswerSheets',
      search: `?assignmentId=${assignmentId}&groupId=${groupId}&sessionId=${_sessionId}`,
    })
  }, [])

  const handleDrop = useCallback(
    ([file]) =>
      createOmrUploadSession({
        file,
        assignmentId,
        groupId,
        handleUploadProgress,
        setCancelUpload,
      }),
    [assignmentId, groupId]
  )

  const handleAbortClick = useCallback(
    (source) =>
      abortOmrUploadSession({
        assignmentId,
        groupId,
        sessionId,
        uploadRunner,
        source,
      }),
    [assignmentId, groupId, sessionId, uploadRunner]
  )

  useEffect(() => {
    getOmrUploadSessions({
      assignmentId,
      groupId,
      sessionId,
      fromWebcam: fromWebcam === 'true',
      aborted: true,
    })
  }, [])

  useEffect(() => {
    const checkForUpdate =
      sessionId &&
      !uploading &&
      currentSession?.status == omrUploadSessionStatus.SCANNING &&
      pageDocs.length &&
      !scanInProgress
    if (checkForUpdate) {
      updateOmrUploadSession({
        assignmentId,
        groupId,
        sessionId,
        pageDocs,
        currentSession,
        status: omrUploadSessionStatus.DONE,
      })
    }
  }, [sessionId, scanInProgress])

  const sessionPageComponent =
    currentSession?.status > omrUploadSessionStatus.SCANNING ? (
      <SessionPage
        sessionStatus={currentSession.status}
        sessionMessage={currentSession.message}
        assignmentId={assignmentId}
        groupId={groupId}
        pages={currentSession.pages}
        showResponses={showResponses}
        responsePageNumber={responsePageNumber}
        setResponsePageNumber={setResponsePageNumber}
      />
    ) : (
      <SessionPage
        assignmentId={assignmentId}
        groupId={groupId}
        pages={pageDocs}
        handleAbortClick={
          scanInProgress ? () => handleAbortClick('session') : null
        }
        showResponses={showResponses}
        responsePageNumber={responsePageNumber}
        setResponsePageNumber={setResponsePageNumber}
      />
    )

  return (
    <PageLayout
      assignmentTitle={assignmentTitle}
      classTitle={classTitle}
      breadcrumbData={breadcrumbData}
    >
      {
        // TODO: refactor this waterfall ternary logic and move it out of render block
        loading ? (
          <Spin />
        ) : showSessions ? (
          <SessionsPage
            sessions={omrUploadSessions}
            onSessionClick={handleSessionClick}
          />
        ) : !sessionId || uploading ? (
          <UploadPage
            uploading={uploading}
            uploadProgress={uploadProgress}
            currentSession={currentSession}
            handleDrop={handleDrop}
            handleCancelUpload={
              uploading && sessionId && cancelUpload ? handleAbortClick : null
            }
          />
        ) : (
          sessionPageComponent
        )
      }
    </PageLayout>
  )
}

const compose = connect((state) => ({ ...selector(state) }), { ...actions })

export default compose(UploadAnswerSheets)
