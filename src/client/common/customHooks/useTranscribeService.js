import { useEffect, useRef } from 'react'
import { test as testConstants } from '@edulastic/constants'
import { notification } from '@edulastic/common'
import {
  FAILED,
  GENERATED,
  IN_PROGRESS,
  NOT_STARTED,
} from '../ducks/Transcribe/constants'
import TranscribeController from '../lib/TranscribeController.js'
import { removePartialText } from './utils'

const { languageCodes } = testConstants

const useTranscribeService = ({
  EditorRef,
  toolbarId,
  isSpeechToTextAllowed,
  generateTranscribeTempCredentials,
  transcribeTempCredentialsAPIStatus,
  transcribeTempCredentials,
  stopTranscribeAndResetDataInStore,
  updateTranscribeSessionId,
  activeTranscribeSessionId,
  currentTranscribeToolBarId,
  setIsVoiceRecognitionActive,
}) => {
  // TODO: test with existing data/student user response
  // TODO: let transcribeControllerData. Reset on unmount
  // TODO: clicking out side should stop
  // TODO: do it only if isSpeechToTextAllowed any operation
  // TODO: if 1 is active and user clicks on second
  // TODO: check in student attempt, active and click on next button
  // TODO: css mic icon

  /**
   * Note: Use the ref variables for comparison in callback methods that are called from froala events
   */
  const transcribeControllerRef = useRef(null)
  const transcribeTempCredentialsAPIStatusRef = useRef(NOT_STARTED)
  const activeTranscribeSessionIdRef = useRef(null)
  const currentTranscribeToolBarIdRef = useRef(null)

  const stopSpeechToTextAndReset = (hasErrorOccured = false, message = '') => {
    stopTranscribeAndResetDataInStore()
    transcribeControllerRef?.current?.stopSpeechToText()
    if (hasErrorOccured) {
      notification({
        type: 'error',
        msg:
          message ||
          'An error occured while recognizing speech. Please try again.',
      })
    }
  }

  // callback called from froala event
  const onSpeechToTextClick = () => {
    // TODO: avoid toggle if credentials are being generated
    if (isSpeechToTextAllowed) {
      if (transcribeTempCredentialsAPIStatusRef.current === NOT_STARTED) {
        const existingContent = EditorRef.current.html.get()
        // Place cursor to end
        if (existingContent?.length > 0) {
          EditorRef.current?.selection?.setAtEnd?.(
            EditorRef.current?.$el?.get?.(0)
          )
          EditorRef.current?.selection?.restore?.()
        }
        generateTranscribeTempCredentials({ toolbarId })
        return
      }

      if (
        transcribeTempCredentialsAPIStatusRef.current === GENERATED &&
        activeTranscribeSessionIdRef.current
      ) {
        stopSpeechToTextAndReset()
      }
    }
  }

  // callback called from froala event
  const handleBlurForSpeechToText = () => {
    console.log('blur handleBlurForSpeechToText===')
    if (isSpeechToTextAllowed) {
      if (
        currentTranscribeToolBarIdRef.current === toolbarId &&
        (transcribeTempCredentialsAPIStatusRef.current === IN_PROGRESS ||
          (transcribeTempCredentialsAPIStatusRef.current === GENERATED &&
            activeTranscribeSessionIdRef.current))
      ) {
        console.log('blur handleBlurForSpeechToText2===')
        stopSpeechToTextAndReset()
      }
    }
  }

  const updateText = ({ text, final }) => {
    console.log('updateText', { text, final })
    if (final) {
      removePartialText({
        EditorRef,
        stopSpeechToTextAndReset,
      })
      EditorRef.current.html.insert(`${text}`)
    } else {
      removePartialText({
        EditorRef,
        stopSpeechToTextAndReset,
      })
      EditorRef.current.html.insert(`<span id="partial-stt">${text}...</span>`)
    }
  }

  useEffect(() => {
    if (isSpeechToTextAllowed) {
      if (!transcribeControllerRef.current) {
        transcribeControllerRef.current = new TranscribeController()
      }
      return () => {
        transcribeControllerRef.current = null
        stopSpeechToTextAndReset()
      }
    }
  }, [])

  useEffect(() => {
    if (isSpeechToTextAllowed) {
      transcribeTempCredentialsAPIStatusRef.current = transcribeTempCredentialsAPIStatus
      if (transcribeTempCredentialsAPIStatus === FAILED) {
        stopTranscribeAndResetDataInStore()
      }
    }
  }, [transcribeTempCredentialsAPIStatus])

  useEffect(() => {
    ;(async () => {
      if (
        isSpeechToTextAllowed &&
        transcribeTempCredentialsAPIStatus === GENERATED &&
        transcribeControllerRef?.current &&
        currentTranscribeToolBarId === toolbarId
      ) {
        const {
          error = null,
        } = await transcribeControllerRef.current?.startSpeechToText({
          configData: {
            region: process.env.REACT_APP_AWS_REGION,
            ...transcribeTempCredentials,
          },
          preferredLanguage: languageCodes.ENGLISH,
          updateText,
          updateTranscribeSessionId,
        })

        if (error) {
          console.log('start error=====', error)
          stopSpeechToTextAndReset(true)
        }
      }
    })()
  }, [transcribeTempCredentialsAPIStatus])

  useEffect(() => {
    if (isSpeechToTextAllowed) {
      activeTranscribeSessionIdRef.current = activeTranscribeSessionId
      if (
        activeTranscribeSessionId &&
        currentTranscribeToolBarId === toolbarId
      ) {
        notification({
          type: 'info',
          msg: 'Start speaking to enter text',
        })
        setIsVoiceRecognitionActive(true)
      } else {
        setIsVoiceRecognitionActive(false)
      }
    }
  }, [activeTranscribeSessionId])

  useEffect(() => {
    if (isSpeechToTextAllowed) {
      currentTranscribeToolBarIdRef.current = currentTranscribeToolBarId
    }
  }, [currentTranscribeToolBarId])

  return { onSpeechToTextClick, handleBlurForSpeechToText }
}

export default useTranscribeService
