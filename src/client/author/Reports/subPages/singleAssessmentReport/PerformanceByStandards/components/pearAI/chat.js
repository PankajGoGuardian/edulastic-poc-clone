import React, { useRef, useState } from 'react'
import { FlexContainer } from '@edulastic/common'
import { StyledTextArea, ChatBubble } from './styled'
import { AI_CHAT_ROLES, getUserMessage } from '../../utils'

const Chat = ({ messages, setMessages, loading }) => {
  const [message, setMessage] = useState('')
  const messagWindowRef = useRef(null)

  const handleOnTextAreaChange = (e) => {
    setMessage(e.target.value)
  }

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault()

      const newMessages = [
        ...messages,
        {
          content: getUserMessage(message),
          chatText: message,
          role: AI_CHAT_ROLES.USER,
        },
      ]
      setMessages(newMessages)
      console.log(messagWindowRef.current, messagWindowRef.current.scrollHeight)
      //   console.log(messagWindowRef, messagWindowRef.current.scrollTo)
      //   messagWindowRef.current.scrollTo({
      //     behavior: 'smooth',
      //     top: messagWindowRef.scrollHeight,
      //   })
      document.getElementById('chatBody').scrollTo({
        top: 200 + messagWindowRef.current.scrollHeight,
        behavior: 'smooth',
      })

      setMessage('')
    }
  }

  return (
    <div style={{ height: '100%', padding: '10px' }}>
      <h2>Chat</h2>
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
          }}
        >
          {messages.map(({ chatText, role }) =>
            role !== AI_CHAT_ROLES.SYSTEM ? (
              <ChatBubble
                key={chatText}
                type="flex"
                justify={role === AI_CHAT_ROLES.USER ? 'end' : 'start'}
                $bgColor={role === AI_CHAT_ROLES.USER ? '#B8F89A' : '#E3E3E3'}
              >
                {chatText}
              </ChatBubble>
            ) : null
          )}
        </div>
        <StyledTextArea
          value={message}
          rows={1}
          placeholder="Ask PearAI"
          onKeyDown={onEnterPress}
          onChange={handleOnTextAreaChange}
        />
      </FlexContainer>
    </div>
  )
}

export default Chat
