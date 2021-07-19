import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Spin, Row, Col } from 'antd'
import qs from 'qs'

import { PageLayout } from './components/PageLayout'
import { DropzoneContainer } from './components/DropzoneContainer'
import { UploadedSessions } from './components/UploadedSessions'
import { Thumbnail, ThumbnailDropdown } from './components/Thumbnail'
import { ScannedResponses } from './components/ScannedResponses'

import {
  processStatusMap,
  thumbnailFilterOptions,
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
  const [showResponses, setShowResponses] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [thumbnailFilter, setThumbnailFilter] = useState(
    thumbnailFilterOptions[0]
  )

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

  const handleDropdownChange = useCallback(
    (value) => {
      if (value) setThumbnailFilter(value)
      else setThumbnailFilter(thumbnailFilterOptions[0])
    },
    [thumbnailFilterOptions]
  )

  useEffect(() => {
    getOmrUploadSessions({ assignmentId, groupId, sessionId })
  }, [])

  return (
    <PageLayout title="Scan Student Responses">
      {loading ? (
        <Spin />
      ) : !sessionId || uploading ? (
        <Row gutter={[5, 10]}>
          <Col span={24}>
            <DropzoneContainer
              handleDrop={handleDrop}
              uploadProgress={uploadProgress}
            />
          </Col>
          {/* NOTE: Uncomment handleCardClick & below code to show uploaded sessions */}
          {/* <UploadedSessions
            uploadSessions={omrUploadSessions}
            handleCardClick={handleCardClick}
            getUploadSessions={() =>
              getOmrUploadSessions({ assignmentId, groupId })
            }
          /> */}
        </Row>
      ) : currentSession.status > 2 &&
        currentSession.pages?.length &&
        showResponses ? (
        <ScannedResponses
          docs={currentSession.pages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          closePage={() => {
            setShowResponses(false)
            setPageNumber(1)
          }}
        />
      ) : currentSession.status > 2 && currentSession.pages?.length ? (
        <>
          <div style={{ margin: '20px 40px' }}>
            <ThumbnailDropdown
              value={thumbnailFilter}
              options={thumbnailFilterOptions}
              handleChange={handleDropdownChange}
            />
          </div>
          <div
            style={{ display: 'flex', margin: '10px 40px', flexWrap: 'wrap' }}
          >
            {currentSession.pages
              .filter(
                (page) =>
                  !thumbnailFilter.key || thumbnailFilter.key == page.status
              )
              .map((page, index) => {
                const name = page.studentName || getFileNameFromUri(page.uri)
                const onClick = () => {
                  setPageNumber(index + 1)
                  setShowResponses(true)
                }
                return (
                  <Thumbnail
                    name={name}
                    uri={page.uri}
                    status={page.status}
                    message={page.message}
                    onClick={page.status === 3 ? onClick : null}
                  />
                )
              })}
          </div>
        </>
      ) : showResponses ? (
        <ScannedResponses
          docs={pageDocs}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          closePage={() => {
            setShowResponses(false)
            setPageNumber(1)
          }}
        />
      ) : (
        <>
          <div style={{ margin: '20px 40px' }}>
            <ThumbnailDropdown
              value={thumbnailFilter}
              options={thumbnailFilterOptions}
              handleChange={handleDropdownChange}
            />
          </div>
          <div
            style={{ display: 'flex', margin: '10px 40px', flexWrap: 'wrap' }}
          >
            {pageDocs
              .filter(
                (page) =>
                  !thumbnailFilter.key || thumbnailFilter.key == page.status
              )
              .map((page, index) => {
                const name = page.studentName || getFileNameFromUri(page.uri)
                const onClick = () => {
                  setPageNumber(index + 1)
                  setShowResponses(true)
                }
                return (
                  <Thumbnail
                    name={name}
                    uri={page.uri}
                    status={page.status}
                    message={page.message}
                    onClick={page.status === 3 ? onClick : null}
                  />
                )
              })}
          </div>
        </>
      )}
    </PageLayout>
  )
}

const compose = connect((state) => ({ ...selector(state) }), { ...actions })

export default compose(UploadAnswerSheets)
