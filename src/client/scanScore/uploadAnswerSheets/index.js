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
  setUploadProgress,
  getOmrUploadSessions,
  setOmrUploadSession,
  createOmrUploadSession,
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

  const handleProgress = useCallback((progressInfo) => {
    const { loaded: uploaded, total } = progressInfo
    const progress = Math.floor((100 * uploaded) / total)
    setUploadProgress(progress)
  }, [])

  const handleCancel = useCallback(() => {}, [])

  const handleDrop = useCallback(
    ([file]) =>
      createOmrUploadSession({
        file,
        assignmentId,
        groupId,
        handleProgress,
        handleCancel,
      }),
    [assignmentId, groupId]
  )

  const handleAbortClick = useCallback(() => {}, [])

  useEffect(() => {
    getOmrUploadSessions({ assignmentId, groupId, sessionId })
  }, [])

  return (
    <PageLayout title="Scan Student Responses">
      {loading ? (
        <Spin />
      ) : !sessionId || uploading ? (
        <>
          <DropzoneContainer
            handleDrop={handleDrop}
            uploadProgress={uploadProgress}
          />
          <SessionsPage
            sessions={omrUploadSessions}
            onSessionClick={handleSessionClick}
          />
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
