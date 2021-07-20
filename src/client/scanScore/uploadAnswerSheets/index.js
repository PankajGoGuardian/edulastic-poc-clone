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
  loading,
  omrUploadSessions,
  currentSession,
  omrSheetDocs,
  setCancelUpload,
  handleUploadProgress,
  getOmrUploadSessions,
  setOmrUploadSession,
  createOmrUploadSession,
  abortOmrUploadSession,
}) => {
  const { assignmentId = '', groupId = '', sessionId = '' } = useMemo(
    () => qs.parse(location?.search || '', { ignoreQueryPrefix: true }),
    [location?.search]
  )

  const pageDocs = useMemo(() => {
    const _pageDocs = omrSheetDocs?.[assignmentId]?.[sessionId] || []
    return _pageDocs.map((d) => ({
      _id: d.sessionId,
      uri: d.uri,
      scannedUri: d.scannedUri,
      studentName: d.studentName,
      status: processStatusMap[d.processStatus],
      message: d.message,
    }))
  }, [omrSheetDocs, assignmentId, sessionId])

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
    () => abortOmrUploadSession({ assignmentId, groupId, sessionId }),
    [assignmentId, groupId, sessionId]
  )

  useEffect(() => {
    // NOTE: Uncomment to list uploaded sessions
    // getOmrUploadSessions({ assignmentId, groupId, sessionId })
  }, [])

  return (
    <PageLayout title="Scan Student Responses">
      {loading ? (
        <Spin />
      ) : !sessionId || uploading ? (
        <>
          <DropzoneContainer
            uploading={uploading}
            handleDrop={handleDrop}
            uploadProgress={uploadProgress}
            handleCancelUpload={
              sessionId && uploading ? handleAbortClick : null
            }
          />
          {/* NOTE: Uncomment to list uploaded sessions */}
          {/* <SessionsPage
            sessions={omrUploadSessions}
            onSessionClick={handleSessionClick}
          /> */}
        </>
      ) : currentSession.status > 2 && currentSession.pages?.length ? (
        <SessionPage pages={currentSession.pages} />
      ) : (
        <SessionPage pages={pageDocs} handleAbortClick={handleAbortClick} />
      )}
    </PageLayout>
  )
}

const compose = connect((state) => ({ ...selector(state) }), { ...actions })

export default compose(UploadAnswerSheets)
