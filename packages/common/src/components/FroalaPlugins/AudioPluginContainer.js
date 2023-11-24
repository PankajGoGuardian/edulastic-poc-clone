import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Icon from 'antd/lib/icon'
import Card from 'antd/lib/card'
import Row from 'antd/lib/row'
import Upload from 'antd/lib/upload'
import {
  IconWhiteMic,
  IconWhiteStop,
  IconLink,
  IconCloudUploadOutline,
} from '@edulastic/icons'
import { aws } from '@edulastic/constants'
import { StyledButton } from '../../../../../src/client/assessment/widgets/AudioResponse/styledComponents/AudioRecorder'
import {
  RECORDING_ACTIVE,
  maxAudioDurationLimit,
} from '../../../../../src/client/assessment/widgets/AudioResponse/constants'
import useAudioRecorder from '../../../../../src/client/assessment/widgets/AudioResponse/hooks/useAudioRecorder'
import { EduIf } from '../ControlStatement/EduIf'
import ErrorPopup from '../../../../../src/client/assessment/widgets/AudioResponse/components/ErrorPopup'
import { uploadToS3 } from '../../helpers'
import { audioUploadFileLimit } from './constants'
import { Button } from '../StyledComponents'
import { getFormattedTimeInMinutesAndSeconds } from '../../../../../src/client/assessment/utils/timeUtils'
import EduButton from '../EduButton'

const { Dragger } = Upload

let timer

const tabList = [
  {
    key: 'audioRecord',
    tab: <Icon className="fr-btn" data-title="Record Audio" type="audio" />,
  },
  {
    key: 'audioUrl',
    tab: (
      <div className="fr-btn" data-title="Audio By URL">
        <IconLink />
      </div>
    ),
  },
  {
    key: 'audioUpload',
    tab: (
      <div className="fr-btn" data-title="Upload Audio">
        <IconCloudUploadOutline />
      </div>
    ),
  },
]

const audioAllowedTypes = ['mp3', 'mpeg', 'x-m4a', 'ogg', 'wav', 'm4a']

const errorMessages = {
  MISSING_LINK: 'No link in upload response.',
  INVALID_URL: 'Enter a valid audio url',
  MAX_SIZE_ERROR: 'Maximum allowed audio size limit is 10mb',
  ERROR_DURING_UPLOAD: 'Error during file upload.',
  BAD_RESPONSE: 'Parsing response failed.',
  BAD_FILE_TYPE: `Unsupported file type - supported audio files are ${audioAllowedTypes.join()}`,
}

const AudioPopup = ({ EditorRef }) => {
  const [selectedTab, setSelectedTab] = useState('audioRecord')
  const [progressData, setProgressData] = useState(null)
  const [audioError, setAudioError] = useState(null)

  const editorId = EditorRef.current.id

  const setErrorData = (error) => {
    setAudioError(error)
  }

  const insertAudio = (url) => {
    // set cursor at the end of content
    EditorRef.current.selection.restore()
    // EditorRef.current.selection.clear()

    EditorRef.current.html.insert(
      `<audio contenteditable="false" controls="controls" src="${url}" controlsList="nodownload"></audio>`
    )
    // if html is inserted over using editor methods `saveStep` requires to be called to update the editor.
    EditorRef.current.undo.saveStep()
    EditorRef.current.popups.hide('audio.insert')
  }

  const validateAndUploadFile = (audioFile) => {
    const {
      MISSING_LINK,
      ERROR_DURING_UPLOAD,
      BAD_FILE_TYPE,
      MAX_SIZE_ERROR,
    } = errorMessages
    if (!audioAllowedTypes.includes(audioFile.type.replace(/audio\//g, ''))) {
      setProgressData({ show: true, message: BAD_FILE_TYPE, isError: true })
      return false
    }

    const size = audioFile.size / (1024 * 1024)
    if (selectedTab !== 'audioRecord' && size > audioUploadFileLimit) {
      setProgressData({ show: true, message: MAX_SIZE_ERROR, isError: true })
      return false
    }

    setProgressData({ show: true, message: 'Uploading', isLoading: true })

    uploadToS3(audioFile, aws.s3Folders.DEFAULT)
      .then((url) => {
        if (url) {
          setProgressData({ show: true, message: 'Successfully Uploaded' })
          insertAudio(url)
        } else {
          setProgressData({ show: true, message: MISSING_LINK, isError: true })
        }
        setTimeout(() => {
          setProgressData({ show: false })
        }, 1000)
      })
      .catch(() => {
        setProgressData({
          show: true,
          message: ERROR_DURING_UPLOAD,
          isError: true,
        })
        setTimeout(() => {
          setProgressData({ show: false })
        }, 1000)
      })
  }

  const content = {
    audioRecord: (
      <AudioRecord
        EditorRef={EditorRef}
        validateAndUploadFile={validateAndUploadFile}
        setErrorData={setErrorData}
      />
    ),
    audioUrl: (
      <AudioByURL
        editorId={editorId}
        setProgressData={setProgressData}
        insertAudio={insertAudio}
      />
    ),
    audioUpload: (
      <AudioUpload
        editorId={editorId}
        validateAndUploadFile={validateAndUploadFile}
      />
    ),
  }
  return (
    <StyledCard
      style={{ width: 300 }}
      tabList={tabList}
      activeTabKey={selectedTab}
      onTabChange={(key) => {
        setSelectedTab(key)
      }}
    >
      <EduIf condition={audioError}>
        <ErrorPopup
          isOpen={audioError?.isOpen}
          errorMessage={audioError?.errorMessage}
          setErrorData={setErrorData}
        />
      </EduIf>
      {progressData?.show ? (
        <Progress {...progressData} />
      ) : (
        content[selectedTab]
      )}
      {progressData?.isError && (
        <EduButton onClick={() => setProgressData({ show: false })}>
          Retry
        </EduButton>
      )}
    </StyledCard>
  )
}

const Progress = ({ message, isLoading = false, isError = false }) => {
  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ flexDirection: 'column' }}
    >
      {isLoading ? (
        <Icon type="loading" style={{ fontSize: 32, color: '#19b394' }} />
      ) : isError ? (
        <Icon
          type="close-circle"
          theme="filled"
          style={{ fontSize: 32, color: '#ea4335' }}
        />
      ) : (
        <Icon
          type="check-circle"
          theme="filled"
          style={{ fontSize: 32, color: '#19b394' }}
        />
      )}
      <h3 style={{ marginTop: 10, textAlign: 'center' }} className="fr-message">
        {message}
      </h3>
    </Row>
  )
}

const AudioRecord = ({ EditorRef, validateAndUploadFile, setErrorData }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [time, setTime] = useState(0)
  const maxmilliseconds = maxAudioDurationLimit * 60 * 1000
  const editorId = EditorRef.current.id

  const onChangeRecordingState = (recordingState) => {
    setIsRecording(recordingState === RECORDING_ACTIVE)
    EditorRef.current.isRecording = true
  }
  const onRecordingComplete = ({ audioFile }) => {
    clearInterval(timer)
    setIsRecording(false)
    EditorRef.current.isRecording = false
    validateAndUploadFile(audioFile)
  }

  const { onClickRecordAudio, onClickStopRecording } = useAudioRecorder({
    onChangeRecordingState,
    onRecordingComplete,
    setErrorData,
    userId: 'audio-plugin',
  })

  useEffect(() => {
    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (isRecording) {
      let ms = 0
      timer = setInterval(() => {
        if (ms === maxmilliseconds) {
          onClickStopRecording()
        }
        ms += 1000
        setTime(ms)
      }, 1000)
    }
  }, [isRecording])

  return (
    <div id={`fr-audio-record-layer-${editorId}`}>
      <Row
        type="flex"
        justify="center"
        align="middle"
        className="fr-input-line"
        style={{ flexDirection: 'column' }}
      >
        <StyledButton
          onClick={isRecording ? onClickStopRecording : onClickRecordAudio}
          isRecording={isRecording}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isRecording ? <IconWhiteStop /> : <IconWhiteMic />}
        </StyledButton>
        <p style={{ marginTop: 10 }}>
          {isRecording ? `Recording...` : 'Tap on mic to record'}
        </p>
        {isRecording && (
          <small>
            {`${getFormattedTimeInMinutesAndSeconds(
              time
            )} | ${getFormattedTimeInMinutesAndSeconds(
              maxmilliseconds - time
            )} left`}
          </small>
        )}
        <small style={{ color: '#666' }}>
          {isRecording ? 'Click to stop recording' : '(upto 5 minutes)'}
        </small>
      </Row>
    </div>
  )
}

const AudioByURL = ({ editorId, setProgressData, insertAudio }) => {
  const [inputFocus, setInputFocus] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')

  function sanitizeAndValidateURL(url) {
    try {
      // Strip leading and trailing spaces
      url = url.trim()
      url = new URL(url)
      // Check if the URL starts with a valid protocol
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol')
      }
      const extension = url.href?.split('.')?.pop()
      if (!audioAllowedTypes.includes(extension)) {
        throw new Error('Invalid URL format')
      }
      return url.href
    } catch (error) {
      throw new Error('Invalid URL format')
    }
  }

  function isValidAudio(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration
        if (duration > 0) {
          resolve(true)
        } else {
          reject(new Error('Invalid audio duration'))
        }
      })
      audio.addEventListener('error', () => {
        reject(new Error('Error loading audio'))
      })
      audio.src = url
    })
  }

  const validateUrl = async () => {
    const { INVALID_URL } = errorMessages
    try {
      setProgressData({ show: true, message: 'Inserting', isLoading: true })
      const url = sanitizeAndValidateURL(audioUrl)
      await isValidAudio(url)
      insertAudio(url)
    } catch (error) {
      setProgressData({
        show: true,
        message: INVALID_URL,
        isError: true,
      })
    }
  }

  return (
    <div className="audio-layer" id={`fr-audio-by-url-layer-${editorId}`}>
      <div className="fr-input-line">
        <input
          className="fr-not-empty"
          id={`fr-audio-by-url-layer-text-${editorId}`}
          type="text"
          placeholder={inputFocus ? '' : 'Paste audio url'}
          aria-required="true"
          onFocus={() => setInputFocus(true)}
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
        />
        {inputFocus && <label>Paste audio url</label>}
      </div>
      <div className="fr-action-buttons">
        <Button
          type="button"
          disabled={audioUrl.length === 0}
          onClick={validateUrl}
        >
          Insert
        </Button>
      </div>
    </div>
  )
}

const AudioUpload = ({ editorId, validateAndUploadFile }) => {
  return (
    <div
      className="audio-layer fr-audio-upload-layer fr-file-upload-layer"
      id={`fr-audio-upload-layer-${editorId}`}
    >
      <Dragger
        accept="audio/*"
        name="file"
        action={null}
        onChange={({ file }) => validateAndUploadFile(file.originFileObj)}
      >
        <strong>Drop audio file (mp3)</strong>
        <br />
        (or click)
      </Dragger>
    </div>
  )
}

const StyledCard = styled(Card)`
  border-radius: 6px;
  height: 203px;
  .ant-card-head {
    padding: 0;
    border-bottom: none;
    .ant-tabs-bar {
      border-bottom: none;
      padding: 5px;
      margin: 0;
      .ant-tabs-tab {
        padding: 0;
        margin: 2px;
        border-radius: 4px;
        height: 40px;
        svg {
          width: 24px;
          height: 24px;
          display: block;
          text-align: center;
          float: none;
          margin: 8px 7px;
        }
        &::before {
          content: none;
        }
        .anticon-audio {
          vertical-align: 0;
          height: 100%;
          margin: 0;
          svg {
            height: 20px;
          }
        }
        &:hover {
          background: #ebebeb;
        }
        &.ant-tabs-tab-active {
          color: #1890ff;
          path {
            fill: #1890ff;
          }
        }
      }
      .ant-tabs-ink-bar {
        background: transparent;
      }
    }
  }
  .ant-card-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(203px - 48px);
    .audio-layer {
      width: 100%;
    }
    .fr-file-upload-layer {
      margin: 0;
      padding: 0;
    }
  }
`

export default AudioPopup
