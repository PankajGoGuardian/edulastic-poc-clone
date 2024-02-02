import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import io from 'socket.io-client'

import QuestionTextArea from '../../../../src/client/assessment/components/QuestionTextArea'
import { Subtitle } from '../../../../src/client/assessment/styled/Subtitle'

import Question from '../../../../src/client/assessment/components/Question'

const socket = io.connect('http://localhost:3000')

const ComposeQuestion = ({
  fillQuestionSections,
  clearQuestionSections,
  handleQuestionChange,
  composeQuestionLabel,
  stimulusContent,
  itemTitle,
}) => {
  const [message, setMessage] = useState('')
  const [messageReceived, setMessageReceived] = useState('')

  const sendMessage = () => {
    console.log('Button clicked')
    socket.emit('send_message', { message })
  }

  const startRecording = async () => {
    const audioContext = new AudioContext()
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })
    const mediaSource = audioContext.createMediaStreamSource(mediaStream)
    const audioProcessor = audioContext.createScriptProcessor(4096, 1, 1)
    mediaSource.connect(audioProcessor)
    audioProcessor.connect(audioContext.destination)

    audioProcessor.onaudioprocess = (event) => {
      console.log('recording in progress+++')
      const inputData = event.inputBuffer.getChannelData(0)
      const chunkSize = 44100 // Adjust based on your requirements

      for (let i = 0; i < inputData.length; i += chunkSize) {
        const chunk = inputData.subarray(i, i + chunkSize)
        socket.emit('send_message', new Uint8Array(chunk.buffer))
      }
    }
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      // console.log('receive_message, data', data)
      setMessageReceived(data.message)
    })
  }, [socket])

  return (
    <>
      <Question
        section="main"
        label={composeQuestionLabel}
        fillSections={fillQuestionSections}
        cleanSections={clearQuestionSections}
      >
        <Subtitle
          id={getFormattedAttrId(`${itemTitle}-${composeQuestionLabel}`)}
        >
          {composeQuestionLabel}
        </Subtitle>

        <QuestionTextArea
          onChange={handleQuestionChange}
          value={stimulusContent}
          border="border"
        />
      </Question>
      <input
        placeholder="Message"
        onChange={(e) => {
          setMessage(e.target.value)
        }}
      />
      <button onClick={startRecording}>Start recording</button>
      <h1>Message: {messageReceived}</h1>
    </>
  )
}

ComposeQuestion.propTypes = {
  handleQuestionChange: PropTypes.func.isRequired,
  composeQuestionLabel: PropTypes.string.isRequired,
  stimulusContent: PropTypes.string.isRequired,
  itemTitle: PropTypes.string.isRequired,
  fillQuestionSections: PropTypes.func,
  clearQuestionSections: PropTypes.func,
}

ComposeQuestion.defaultProps = {
  fillQuestionSections: () => {},
  clearQuestionSections: () => {},
}

export default ComposeQuestion
