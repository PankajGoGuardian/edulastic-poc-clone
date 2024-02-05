import React, { useMemo, useState } from 'react'
import { Row, Col, Spin, Tabs } from 'antd'

import { greyThemeLighter } from '@edulastic/colors'

import { StyledCard } from './styled'
import Chat from './chat'
import { AI_CHAT_ROLES, DEFAULT_QUESTIONS_TEXT } from '../../utils'

const { TabPane } = Tabs

const PearAi = ({ messages, setMessages, loading }) => {
  const [selectedMessage, setSelectedMessage] = useState('')

  const { suggestedQuestions, summaryText } = useMemo(() => {
    const messagesWithQuestions = messages
      .slice(3)
      .filter((m) => m.role === AI_CHAT_ROLES.ASSISTANT && m.questionsText)
    const lastMessageWithQuestion =
      messagesWithQuestions[messagesWithQuestions.length - 1]
    const summaryMessageText = messages[2]?.chatText || ''
    return {
      suggestedQuestions: (
        lastMessageWithQuestion?.questionsText || DEFAULT_QUESTIONS_TEXT
      )
        .split('?')
        .filter((t) => t.trim())
        .map((t) => `${String(t).trim().slice(2)}?`),
      summaryText: summaryMessageText,
    }
  }, [messages])

  return (
    <Row type="flex">
      <Col span={24}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Summary" key="1" style={{ borderRadius: '10px' }}>
            <Spin spinning={loading}>
              <StyledCard title="Summary" style={{ width: '100%' }}>
                {summaryText}
              </StyledCard>
            </Spin>
          </TabPane>
          <TabPane tab="Ask Pear AI" key="2" style={{ borderRadius: '10px' }}>
            <Row
              type="flex"
              justify="start"
              style={{
                height: '300px',
                marginTop: '20px',
                background: greyThemeLighter,
                borderRadius: '10px',
              }}
            >
              <Col span={12} style={{ height: '100%' }}>
                <Spin spinning={loading}>
                  <div style={{ height: '100%', padding: '10px' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      Suggested Prompts
                    </h3>
                    {suggestedQuestions.map((questionText) => (
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                      <p
                        onClick={() => {
                          console.log('question text', questionText)
                          setSelectedMessage(questionText)
                        }}
                        style={{
                          marginBottom: '5px',
                          cursor: 'pointer',
                          borderRadius: '20px',
                          padding: '5px 10px',
                          border: '2px solid white',
                        }}
                      >
                        {questionText}
                      </p>
                    ))}
                  </div>
                </Spin>
              </Col>
              <Col span={12} style={{ height: '100%' }}>
                <Spin spinning={loading}>
                  <Chat
                    selectedMessage={selectedMessage}
                    messages={messages}
                    setMessages={setMessages}
                  />
                </Spin>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}

export default PearAi
