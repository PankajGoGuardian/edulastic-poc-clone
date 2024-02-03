import React, { useEffect, useRef, useState } from 'react'
import { FlexContainer } from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { Icon } from 'antd'
import { StyledTextArea, ChatBubble } from './styled'
import { AI_CHAT_ROLES, getUserMessage } from '../../utils'

const Chat = ({ selectedMessage, messages, setMessages, loading }) => {
  const [message, setMessage] = useState('')
  const messagWindowRef = useRef(null)

  const handleOnTextAreaChange = (e) => {
    setMessage(e.target.value)
  }

  const sendMessage = (suggestedMessage = '') => {
    const _message = suggestedMessage || message
    const newMessages = [
      ...messages,
      {
        content: getUserMessage(_message),
        chatText: _message,
        role: AI_CHAT_ROLES.USER,
      },
    ]
    console.log('new messages', newMessages)
    setMessages(newMessages)
    // console.log(messagWindowRef.current, messagWindowRef.current.scrollHeight)
    //   console.log(messagWindowRef, messagWindowRef.current.scrollTo)
    //   messagWindowRef.current.scrollTo({
    //     behavior: 'smooth',
    //     top: messagWindowRef.scrollHeight,
    //   })
    document.getElementById('chatBody').scrollTo({
      top: messagWindowRef.current.scrollHeight,
      behavior: 'smooth',
    })

    setMessage('')
  }

  useEffect(() => {
    console.log('selected message', selectedMessage)
    sendMessage(selectedMessage)
  }, [selectedMessage])

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ height: '100%', padding: '10px', borderRadius: '20px' }}>
      <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>Chat</h3>
      <FlexContainer flexDirection="column" alignItems="space-end">
        <div
          ref={messagWindowRef}
          id="chatBody"
          style={{
            height: '200px',
            display: 'flex',
            flexDirection: 'column  ',
            overflowY: 'scroll',
            paddingRight: '15px',
            background: 'white',
            borderRadius: '20px',
            marginBottom: '10px',
            padding: '5px',
          }}
        >
          {messages.map(({ chatText, role }) =>
            role !== AI_CHAT_ROLES.SYSTEM ? (
              <ChatBubble
                key={chatText}
                type="flex"
                justify={role === AI_CHAT_ROLES.USER ? 'end' : 'start'}
                $bgColor={role === AI_CHAT_ROLES.USER ? themeColor : '#C5CCD1'}
                $color={role === AI_CHAT_ROLES.USER ? 'white' : 'black'}
              >
                {chatText}
              </ChatBubble>
            ) : null
          )}
        </div>
        <FlexContainer>
          <StyledTextArea
            value={message}
            rows={1}
            placeholder="Ask PearAI"
            onKeyDown={onEnterPress}
            onChange={handleOnTextAreaChange}
          />
          <Icon
            type="right-circle"
            theme="filled"
            style={{ fontSize: '30px', color: themeColor, cursor: 'pointer' }}
            onClick={sendMessage}
          />
        </FlexContainer>
      </FlexContainer>
    </div>
  )
}

export default Chat
