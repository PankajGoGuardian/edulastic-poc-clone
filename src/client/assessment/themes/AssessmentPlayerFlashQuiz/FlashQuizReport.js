import { FlexContainer } from '@edulastic/common'
import { Avatar, Descriptions, Divider, Progress } from 'antd'
import React, { useMemo } from 'react'
import {
  StyledTag,
  FlashQuizReportContainer,
  PerformanceContainer,
  PerformanceMetrics,
  StatValue,
} from './styled'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { PdfDocument } from './FlashQuizPDFView'
import { themeColorBlue } from '@edulastic/colors'
import { IconDownload } from '@edulastic/icons'

const FlashQuizReport = ({ user, questions = [], title }) => {
  const data = useMemo(() => {
    const { list = [], possibleResponses = [] } = questions[0] || {}
    return list.map((item) => ({
      id: item.value,
      frontStimulus: item.label,
      backStimulus: possibleResponses.find((el) => el.value === item.value)
        ?.label,
    }))
  }, [questions])

  return (
    <FlashQuizReportContainer>
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        marginBottom="10px"
      >
        <Avatar size={100} style={{ fontSize: 36, fontWeight: 600 }}>
          {user?.username?.slice(0, 2)?.toUpperCase()}
        </Avatar>
        <StyledTag color="geekblue">{user.username}</StyledTag>
      </FlexContainer>
      <h3 style={{ fontWeight: 600 }}>{title}</h3>

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
            <Progress
              type="circle"
              percent={75}
              format={() => `${2}/${data?.length || 0}`}
            />
            <h3>SCORE</h3>
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Progress
              className="percent"
              type="circle"
              percent={Math.round((2 / (data?.length || 1)) * 100)}
            />
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
              format={() => `${5} Mins`}
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
              <StatValue>{data?.length || 0}</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Total Card Flips">
              <StatValue>63</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Total Wrong Flips">
              <StatValue>32</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Learning Time">
              <StatValue>6 mins</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Assessement Time">
              <StatValue>5 mins</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Total Time" span={2}>
              <StatValue>11 mins</StatValue>
            </Descriptions.Item>
          </Descriptions>
        </PerformanceMetrics>
      </PerformanceContainer>
      <PDFDownloadLink
        document={<PdfDocument data={data} />}
        fileName="FlashQuiz.pdf"
        style={{
          width: '200px',
          height: '36px',
          lineHeight: '36px',
          textDecoration: 'none',
          padding: '0 10px',
          color: '#fff',
          backgroundColor: themeColorBlue,
          fontSize: '14px',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        {({ loading }) =>
          loading ? (
            'Loading document...'
          ) : (
            <span>
              Download Flash Cards &nbsp; <IconDownload />
            </span>
          )
        }
      </PDFDownloadLink>
    </FlashQuizReportContainer>
  )
}

export default FlashQuizReport
