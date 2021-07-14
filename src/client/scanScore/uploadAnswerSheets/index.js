import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { createHash } from 'crypto-browserify'
import qs from 'qs'

import { aws } from '@edulastic/constants'
import { notification } from '@edulastic/common'
import { uploadToS3 } from '@edulastic/common/src/helpers'
import { assignmentApi } from '@edulastic/api'

import { OmrDropzone } from './OmrDropzone'
import { OmrThumbnail, getFileNameFromUri } from './OmrThumbnail'

import { getGroupedDocs } from '../ducks'

const createSessionId = (str) => {
  const hash = createHash('sha1').update(str, 'utf8').digest('hex')
  return hash.substring(0, 24)
}

const UploadAnswerSheets = ({ location, groupedDocs }) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const { assignmentId, sessionId } = useMemo(() => {
    const search = qs.parse(location.search || '', { ignoreQueryPrefix: true })
    const _sessionId = createSessionId(`${search.assignmentId}-${Date.now()}`)
    return {
      assignmentId: search.assignmentId,
      sessionId: search.sessionId || _sessionId,
    }
  }, [location])

  const handleProgress = (progressInfo) => {
    const { loaded: uploaded, total } = progressInfo
    const _progress = Math.floor((uploaded / total) * 100)
    setProgress(_progress)
  }

  const handleCancelUpload = () => {}

  const handleDrop = async ([file]) => {
    setUploading(true)
    const _uploadedFiles = []
    let sourceUri = ''
    try {
      sourceUri = await uploadToS3(
        file,
        aws.s3Folders.BUBBLE_SHEETS,
        handleProgress,
        handleCancelUpload,
        `${assignmentId}/${sessionId}`
      )
      if (sourceUri) {
        _uploadedFiles.push({ type: 'sourceUri', uri: sourceUri, file })
      }
    } catch (err) {
      notification({ type: 'error', msg: 'Failed to upload file' })
      console.log(err)
    }
    try {
      const {
        sheetUris = [],
        error,
      } = await assignmentApi.splitScanBubbleSheets({
        assignmentId,
        sessionId,
        source: {
          uri: sourceUri,
          name: file?.name || getFileNameFromUri(sourceUri),
        },
      })
      if (error) {
        notification({ type: 'error', msg: error.message })
      }
      _uploadedFiles.push(
        ...sheetUris.map((sheetUri) => ({ type: 'sheetUri', uri: sheetUri }))
      )
    } catch (e) {
      notification({ type: 'error', msg: 'Failed to scan uploaded file' })
    }
    setUploadedFiles(_uploadedFiles)
    setProgress(null)
    setUploading(false)
  }

  const docsList = useMemo(
    () => groupedDocs?.[assignmentId]?.[sessionId] || [],
    [groupedDocs, assignmentId, sessionId]
  )

  return (
    <>
      <OmrDropzone handleDrop={handleDrop} uploadProgress={progress} />
      <div style={{ display: 'flex', margin: '10px 40px', flexWrap: 'wrap' }}>
        {docsList.map((doc) => (
          <OmrThumbnail key={doc.__id} doc={doc} />
        ))}
      </div>
    </>
  )
}

export default connect(
  (state) => ({
    groupedDocs: getGroupedDocs(state),
  }),
  {}
)(UploadAnswerSheets)
