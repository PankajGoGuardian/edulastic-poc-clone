import React, { useMemo } from 'react'
import { Row, Col, List, Tabs } from 'antd'

import { greyThemeLighter } from '@edulastic/colors'

import { StyledCard } from './styled'
import Chat from './chat'
import { AI_CHAT_ROLES, DEFAULT_QUESTIONS_TEXT } from '../../utils'

const { TabPane } = Tabs

const PearAi = ({ messages, setMessages, loading }) => {
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
        marginTop: '25px',
        border: `1px solid ${greyThemeLighter}`,
      }}
    >
      <Col span={12} style={{ height: '100%' }}>
        <List
          header={<div style={{ fontWeight: 'bold' }}>Suggested Prompts</div>}
          bordered
          dataSource={suggestedQuestions}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Col>
      <Col span={12} style={{ height: '100%' }}>
        <Chat messages={messages} setMessages={setMessages} loading={loading} />
      </Col>
      {/* <Col span={24}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Pear AI Insights" key="1">
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
          <TabPane tab="Ask Pear AI" key="2">
            <Col span={12} style={{ height: '100%' }}>
              <List
                header={
                  <div style={{ fontWeight: 'bold' }}>Suggested Prompts</div>
                }
                bordered
                dataSource={DATA}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
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
