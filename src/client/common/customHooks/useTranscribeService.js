import { useEffect, useRef, useState } from 'react'
import { isEmpty } from 'lodash'
import { speechToTextApi } from '@edulastic/api'

import { test as testConstants } from '@edulastic/constants'
import {
  captureSentryException,
  notification,
  useApiQuery,
} from '@edulastic/common'

import TranscribeController from '../lib/TranscribeController.js'

const { languageCodes } = testConstants

const useTranscribeService = ({
  isEnabled,
  onErrorCallback,
  onInitCallback,
  onTextUpdateCallback,
  onStopCallback,
}) => {
  const onTextUpdateCallbackRef = useRef()

  useEffect(() => {
    onTextUpdateCallbackRef.current = onTextUpdateCallback
  }, [onTextUpdateCallback])

  const transcribeControllerRef = useRef(null)
  const [isTranscribeActive, setIsTranscribeActive] = useState(false)
  const [activeTranscribeSessionId, setActiveTranscribeSessionId] = useState(
    null
  )

  const { data: credentials, error: generateCredentialsError } = useApiQuery(
    speechToTextApi.generateTranscribeCredentials,
    [],
    {
      enabled: isTranscribeActive,
      deDuplicate: false,
    }
  )

  const onStart = ({ isBlurEvent = false } = {}) => {
    if (isBlurEvent) {
      setIsTranscribeActive(false)
      return
    }
    setIsTranscribeActive(
      (prevTranscribeActiveValue) => !prevTranscribeActiveValue
    )
  }

  const stopSpeechToTextAndReset = ({ error } = {}) => {
    setActiveTranscribeSessionId(null)
    transcribeControllerRef?.current?.stopSpeechToText()
    if (error) {
      notification({
        type: 'error',
        msg: 'Speech to text conversion is temporarily unavailable.',
      })
    }
    if (typeof onStopCallback === 'function') {
      onStopCallback({ error })
    }
  }

  useEffect(() => {
    if (isEnabled) {
      if (!transcribeControllerRef.current) {
        transcribeControllerRef.current = new TranscribeController()
      }
      return () => {
        transcribeControllerRef.current = null
        stopSpeechToTextAndReset()
      }
    }
  }, [isEnabled])

  useEffect(() => {
    if (isEnabled) {
      if (generateCredentialsError) {
        onStart()
      }
    }
  }, [isEnabled, generateCredentialsError])

  useEffect(() => {
    if (isEnabled && !isTranscribeActive) {
      stopSpeechToTextAndReset()
    }
  }, [isEnabled, isTranscribeActive])

  useEffect(() => {
    ;(async () => {
      if (
        isEnabled &&
        isTranscribeActive &&
        !activeTranscribeSessionId &&
        !isEmpty(credentials) &&
        transcribeControllerRef?.current
      ) {
        if (typeof onInitCallback === 'function') {
          onInitCallback()
        }
        const {
          error = null,
        } = await transcribeControllerRef.current?.startSpeechToText({
          configData: { ...credentials },
          preferredLanguage: languageCodes.ENGLISH, // In future this will be read from accommodations.
          updateTextRef: onTextUpdateCallbackRef,
          updateTranscribeSessionId: setActiveTranscribeSessionId,
        })

        if (error) {
          if (error?.name === 'NotAllowedError') {
            onErrorCallback({
              errorMessage:
                'Pear Assessment needs access to your microphone to allow typing using your voice input',
            })
            stopSpeechToTextAndReset()
            return
          }
          stopSpeechToTextAndReset({ error })
          captureSentryException(error, {
            errorMessage: `Initiate stt error`,
          })
        }
      }
    })()
  }, [isEnabled, credentials, isTranscribeActive, activeTranscribeSessionId])

  return {
    onStart,
    isLoading: isTranscribeActive && !activeTranscribeSessionId,
    isActive: !!activeTranscribeSessionId,
  }
}

export default useTranscribeService
