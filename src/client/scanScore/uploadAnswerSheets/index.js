import React, { useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import qs from 'qs'

import { PageLayout } from './PageLayout'
import { DropzoneContainer } from './UploadPage/DropzoneContainer'
import SessionsPage from './SessionsPage'
import SessionPage from './SessionPage'
// import UploadPage from './UploadPage'

import { processStatusMap } from './utils'
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
}) => {
  const { assignmentId = '', groupId = '', sessionId = '' } = useMemo(
    () => qs.parse(location?.search || '', { ignoreQueryPrefix: true }),
    [location?.search]
  )

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
        status: processStatusMap[d.processStatus],
        message: d.message,
      })
    )
    const _scanInProgress = !_pageDocs.every(
      (p) => p?.status > 2 && p?.status !== 6
    )
    return { pageDocs: _pageDocs, scanInProgress: _scanInProgress }
  }, [omrSheetDocs, assignmentId, sessionId])

  const breadcrumbData = useMemo(() => {
    const breadcrumbs = [{ title: 'Upload' }]
    if (assignmentId && groupId) {
      breadcrumbs[0].to = `uploadAnswerSheets?assignmentId=${assignmentId}&groupId=${groupId}`
    }
    if (assignmentId && groupId && sessionId) {
      breadcrumbs.push({
        title: 'Session',
        to: `uploadAnswerSheets?assignmentId=${assignmentId}&groupId=${groupId}&sessionId=${sessionId}`,
      })
    }
    return breadcrumbs
  }, [assignmentId, groupId, sessionId])

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
    getOmrUploadSessions({ assignmentId, groupId, sessionId })
  }, [])

  useEffect(() => {
    const checkForUpdate =
      sessionId &&
      !uploading &&
      currentSession?.status == 2 &&
      pageDocs.length &&
      !scanInProgress
    if (checkForUpdate) {
      updateOmrUploadSession({
        assignmentId,
        groupId,
        sessionId,
        pageDocs,
        currentSession,
      })
    }
  }, [sessionId, scanInProgress])

  return (
    <PageLayout title="Scan Student Responses" breadcrumbData={breadcrumbData}>
      {loading ? (
        <Spin />
      ) : !sessionId || uploading ? (
        <>
          <DropzoneContainer
            uploading={uploading}
            handleDrop={handleDrop}
            uploadProgress={uploadProgress}
            handleCancelUpload={
              uploading && sessionId && cancelUpload ? handleAbortClick : null
            }
          />
          {/* NOTE: Uncomment to list uploaded sessions */}
          {/* <SessionsPage
            sessions={omrUploadSessions}
            onSessionClick={handleSessionClick}
          /> */}
        </>
      ) : currentSession?.status > 2 && currentSession.pages?.length ? (
        <SessionPage pages={currentSession.pages} />
      ) : (
        <SessionPage
          pages={pageDocs}
          handleAbortClick={
            scanInProgress ? () => handleAbortClick('session') : null
          }
        />
      )}
    </PageLayout>
  )
}

const compose = connect((state) => ({ ...selector(state) }), { ...actions })

export default compose(UploadAnswerSheets)
