import React, { useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Spin, Row, Col, Card } from 'antd'
import qs from 'qs'

import { OmrDropzone } from './OmrDropzone'
import { OmrThumbnail } from './OmrThumbnail'

import {
  processStatusMap,
  omrUploadSessionStatus,
  getFileNameFromUri,
} from './utils'
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
    () =>
      console.log('this executed') ||
      qs.parse(location?.search || '', { ignoreQueryPrefix: true }),
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
  }, [omrSheetDocs, assignmentId, groupId, sessionId])

  const handleCardClick = useCallback((_sessionId) => {
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

  useEffect(() => {
    getOmrUploadSessions({ assignmentId, groupId, sessionId })
  }, [])

  if (loading && !uploading) {
    return <Spin />
  }

  if (!sessionId) {
    return (
      <Row gutter={[5, 10]}>
        <Col span={24}>
          <OmrDropzone
            handleDrop={handleDrop}
            uploadProgress={uploadProgress}
          />
        </Col>
        {omrUploadSessions.map((session) => (
          <Col span={8} onClick={() => handleCardClick(session._id)}>
            <Card title={session.source.name} bordered="false">
              {`${omrUploadSessionStatus[session.status]}`}
            </Card>
          </Col>
        ))}
      </Row>
    )
  }

  if (currentSession.status > 2 && currentSession.pages?.length) {
    return (
      <div style={{ display: 'flex', margin: '10px 40px', flexWrap: 'wrap' }}>
        {currentSession.pages.map((page) => {
          const name = page.studentName || getFileNameFromUri(page.uri)
          return (
            <OmrThumbnail
              name={name}
              uri={page.uri}
              status={page.status}
              message={page.message}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', margin: '10px 40px', flexWrap: 'wrap' }}>
      {pageDocs.map((page) => {
        const name = page.studentName || getFileNameFromUri(page.uri)
        return (
          <OmrThumbnail
            name={name}
            uri={page.uri}
            status={page.status}
            message={page.message}
          />
        )
      })}
    </div>
  )
}

const compose = connect((state) => ({ ...selector(state) }), { ...actions })

export default compose(UploadAnswerSheets)
