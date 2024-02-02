import React, { useRef, useEffect, useState } from 'react'
import { FlexContainer } from '@edulastic/common'
import { StyledTextArea, ChatBubble } from './styled'

const Roles = {
  SYSTEM: 'system',
  USER: 'user',
}

const Chat = () => {
  const [message, setMessage] = useState('')
  const [chatData, setChatData] = useState([])
  const messagWindowRef = useRef(null)

  useEffect(() => {
    console.log(chatData)
  }, [chatData])

  const handleOnTextAreaChange = (e) => {
    setMessage(e.target.value)
  }

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault()

      const _chatData = [
        ...chatData,
        {
          content: message,
          chatText: message,
          role: Roles.USER,
        },
        {
          content: 'Hi I am pear Ai',
          chatText: 'Hi I am pear Ai',
          role: Roles.SYSTEM,
        },
      ]
      setChatData(_chatData)
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
          {chatData.map(({ content, role }) => (
            <ChatBubble
              key={content}
              type="flex"
              justify={role === Roles.USER ? 'end' : 'start'}
              $bgColor={role === Roles.USER ? '#B8F89A' : '#E3E3E3'}
            >
              {content}
            </ChatBubble>
          ))}
        </div>
        <StyledTextArea
          value={message}
          rows={1}
          placeholder="Enter your message"
          onKeyDown={onEnterPress}
          onChange={handleOnTextAreaChange}
        />
      </FlexContainer>
    </div>
  )
}

export default Chat
