import React, { useMemo, useState } from 'react'
import { Row, Col, List, Tabs } from 'antd'

import { greyThemeLighter } from '@edulastic/colors'

import { StyledCard } from './styled'
import Chat from './chat'
import { AI_CHAT_ROLES, DEFAULT_QUESTIONS_TEXT } from '../../utils'

const { TabPane } = Tabs

const PearAi = ({ messages, setMessages, loading }) => {
  const [selectedMessage, setSelectedMessage] = useState('')
  const suggestedQuestions = useMemo(() => {
    const messagesWithQuestions = messages.filter(
      (m) => m.role === AI_CHAT_ROLES.ASSISTANT && m.questionsText
    )
    const lastMessageWithQuestion =
      messagesWithQuestions[messagesWithQuestions.length - 1]
    return (
      lastMessageWithQuestion?.questionsText || DEFAULT_QUESTIONS_TEXT
    ).split('\n')
  }, [messages])

  return (
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
        {/* <List
          header={<div style={{ fontWeight: 'bold' }}>Suggested Prompts</div>}
          bordered
          dataSource={suggestedQuestions}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        /> */}
      </Col>
      <Col span={12} style={{ height: '100%' }}>
        <Chat
          selectedMessage={selectedMessage}
          messages={messages}
          setMessages={setMessages}
          loading={loading}
        />
      </Col>
      {/* <Col span={24}>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab="Pear AI Insights"
            key="1"
            style={{ background: '#dadada', borderRadius: '10px' }}
          >
            <Col span={12}>
              <StyledCard title="Summary" style={{ width: 300 }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </StyledCard>
            </Col>
            <Col span={12}>
              <StyledCard title="Insights" style={{ width: 300 }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </StyledCard>
            </Col>
          </TabPane>
          <TabPane
            tab="Ask Pear AI"
            key="2"
            style={{ background: '#dadada', borderRadius: '10px' }}
          >
            <Col span={12} style={{ height: '280px', paddingBottom: '10px' }}>
              <div style={{ height: '100%', padding: '10px' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Suggested Prompts
                </h3>
                <div>
                  {DATA.map((questionText) => (
                    <p
                      style={{
                        marginBottom: '5px',
                        cursor: 'pointer',
                        background: 'white',
                        borderRadius: '20px',
                        padding: '5px 10px',
                      }}
                    >
                      {questionText}
                    </p>
                  ))}
                </div>
              </div>
            </Col>
            <Col span={12} style={{ height: '100%' }}>
              <Chat />
            </Col>
          </TabPane>
        </Tabs>
    </Col> */}
    </Row>
  )
}

export default PearAi
