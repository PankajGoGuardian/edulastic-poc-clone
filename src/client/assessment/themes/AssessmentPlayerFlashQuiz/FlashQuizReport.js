import { EduButton, FlexContainer } from '@edulastic/common'
import { Avatar, Descriptions, Divider, Progress } from 'antd'
import React from 'react'
import {
  StyledTag,
  FlashQuizReportContainer,
  PerformanceContainer,
  PerformanceMetrics,
  StatValue,
} from './styled'

const FlashQuizReport = ({ user }) => {
  return (
    <FlashQuizReportContainer>
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        marginBottom="10px"
      >
        <Avatar size={100} style={{ fontSize: 30, fontWeight: 600 }}>
          {user?.username?.slice(0, 2)?.toUpperCase()}
        </Avatar>
        <StyledTag color="geekblue">{user.username}</StyledTag>
      </FlexContainer>
      <h3 style={{ fontWeight: 600 }}>Flash Quiz Test 5 For Kindergarten</h3>

      <PerformanceContainer>
        <FlexContainer
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <FlexContainer
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Progress type="circle" percent={75} format={() => `${8}/10`} />
            <h3>SCORE</h3>
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Progress className="percent" type="circle" percent={75} />
            <h3>PERCENT</h3>
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Progress
              className="time"
              type="circle"
              percent={100}
              format={() => `${8} Mins`}
            />
            <h3>TIME</h3>
          </FlexContainer>
        </FlexContainer>
        <Divider />
        <PerformanceMetrics>
          <Descriptions
            size="middle"
            layout="vertical"
            title="FlashQuiz Statistics"
            bordered
          >
            <Descriptions.Item label="Total FlashCards">
              <StatValue>10</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Total Card Flips">
              <StatValue>10</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Total Wrong Flips">
              <StatValue>10</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Learning Time">
              <StatValue>10</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Assessement Time">
              <StatValue>10</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Total Time" span={2}>
              <StatValue>10</StatValue>
            </Descriptions.Item>
          </Descriptions>
        </PerformanceMetrics>
      </PerformanceContainer>
      <EduButton isBlue>Download Flash Cards</EduButton>
    </FlashQuizReportContainer>
  )
}

export default FlashQuizReport
