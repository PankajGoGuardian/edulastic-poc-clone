import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import styled from 'styled-components'
import {
  uploadToS3,
  FlexContainer,
  EduButton,
  notification,
} from '@edulastic/common'
import { aws, fileTypes } from '@edulastic/constants'

import ProgressBar from './ProgressBar'
import { allowedFiles, MAX_SIZE, MAX_COUNT } from './constants'

const folder = aws.s3Folders.DEFAULT

const Uploader = ({ onCompleted, mt }) => {
  const [filesToUpload, setFilesToUpload] = useState([])
  const toHandleUpload = useRef()
  const inputRef = useRef()

  const saveAnswer = () => {
    const started = toHandleUpload.current.filter((f) => f.status === 'started')
    if (isEmpty(started)) {
      onCompleted(
        toHandleUpload.current
          .filter((f) => f.status === 'completed')
          .map(({ name, size, source, type }) => ({
            type,
            name,
            size,
            source,
          }))
      )
      setFilesToUpload([])
      toHandleUpload.current = []
    } else {
      setFilesToUpload([...toHandleUpload.current])
    }
  }

  const uploadFinished = (index, uri) => {
    if (toHandleUpload.current) {
      toHandleUpload.current[index].status = 'completed'
      toHandleUpload.current[index].source = uri
      saveAnswer()
    }
  }

  const onCancelUpload = (index) => {
    if (toHandleUpload.current) {
      const { cancel } = toHandleUpload.current[index]
      if (typeof cancel === 'function') {
        cancel('Canceled By User')
        toHandleUpload.current[index].status = 'canceled'
        saveAnswer()
      }
    }
  }

  const onProgress = (index) => (e) => {
    if (toHandleUpload.current[index]) {
      const percent = Math.round((e.loaded * 100) / e.total)
      toHandleUpload.current[index].percent = percent
      setFilesToUpload([...toHandleUpload.current])
    }
  }

  const setCancelFn = (index) => (fn) => {
    if (toHandleUpload.current) {
      toHandleUpload.current[index].cancel = fn
    }
  }

  const uploadFile = async (file, index) => {
    try {
      const uri = await uploadToS3(
        file,
        folder,
        onProgress(index),
        setCancelFn(index)
      )
      uploadFinished(index, uri)
    } catch (error) {
      console.log(error)
    }
  }
  const allowedFileTypeForFileUploadQuestion = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'audio/mp3',
    'audio/mpeg',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
  ]
  const handleChange = (e) => {
    const { files } = e.target
    if (files) {
      const filesArr = Object.keys(files)
        .map((key) => {
          const file = files[key]
          const { size } = file
          // validate file type in case of image
          if (!allowedFileTypeForFileUploadQuestion.includes(file.type)) {
            notification({
              msg: `Uploaded file type is not supported`,
            })
            return false
          }
          // image size should be less than 5MB
          if (size > 5 * MAX_SIZE) {
            notification({ messageKey: 'fileSizeError5MB' })
            return false
          }
          return files[key]
        })
        .filter((f) => f)
        .slice(0, MAX_COUNT)

      const toUpload = filesArr.map((f) => ({
        type: f.type,
        size: f.size,
        name: f.name,
        status: 'started',
      }))
      setFilesToUpload(toUpload)
      toHandleUpload.current = toUpload
      filesArr.forEach(uploadFile)
    }
  }

  const onClickHandler = (e) => {
    if (inputRef.current) {
      inputRef.current.click()
      e.target.blur()
    }
  }

  // resetting value to null to detect changes more than once (for same file)
  const resetInputValue = (e) => {
    e.target.value = null
  }

  const progressArr = filesToUpload.filter((f) => f.status !== 'canceled')
  const disableUpload = !isEmpty(progressArr)

  return (
    <FlexContainer
      justifyContent="flex-start"
      mt={mt}
      flexDirection="column"
      width="100%"
    >
      <EduButton
        height="28px"
        width="140px"
        onClick={onClickHandler}
        disabled={disableUpload}
        ml="0px"
      >
        UPLOAD FILE
      </EduButton>

      <UploadInput
        multiple
        type="file"
        ref={inputRef}
        onClick={resetInputValue}
        onChange={handleChange}
        accept={allowedFiles.filter((o) => o !== fileTypes.IMAGES).join()}
      />
      {!isEmpty(progressArr) && (
        <FlexContainer flexWrap="wrap" mt="26px" justifyContent="flex-start">
          {progressArr.map((f, i) => (
            <ProgressBar data={f} key={i} onCancel={onCancelUpload} index={i} />
          ))}
        </FlexContainer>
      )}
    </FlexContainer>
  )
}

Uploader.propTypes = {
  onCompleted: PropTypes.func,
  mt: PropTypes.string,
}

Uploader.defaultProps = {
  onCompleted: () => null,
  mt: '',
}

export default Uploader

const UploadInput = styled.input`
  display: none;
`
