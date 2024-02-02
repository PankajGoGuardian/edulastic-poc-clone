import React from 'react'
import { Row, Col, List, Tabs } from 'antd'
import { StyledCard } from './styled'
import Chat from './chat'

const { TabPane } = Tabs

const DATA = [
  'Which classes are struggling the most, and in what areas?',
  'How can I compare the performance of different classes across the same standards?',
  'What does a low percentage in a specific standard indicate about student understanding?',
  'What does a low percentage in a specific standard indicate about student understanding?',
]

const PearAi = () => {
  return (
    <Row type="flex" justify="start" style={{ height: '300px' }}>
      <Col span={12} style={{ height: '100%' }}>
        <List
          header={<div style={{ fontWeight: 'bold' }}>Suggested Prompts</div>}
          bordered
          dataSource={DATA}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Col>
      <Col span={12} style={{ height: '100%' }}>
        <Chat />
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
