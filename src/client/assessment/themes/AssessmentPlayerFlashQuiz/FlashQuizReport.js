import { FlexContainer } from '@edulastic/common'
import { Avatar, Descriptions, Divider, Progress } from 'antd'
import React, { useMemo } from 'react'
import {
  StyledTag,
  FlashQuizReportContainer,
  PerformanceContainer,
  PerformanceMetrics,
  StatValue,
  AvatarContainer,
} from './styled'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { PdfDocument } from './FlashQuizPDFView'
import { themeColorBlue } from '@edulastic/colors'
import { IconDownload } from '@edulastic/icons'
import { clamp } from 'lodash'
import TrophyBadge from './trophy-badge.png'

const FlashQuizReport = ({
  user,
  questions = [],
  title,
  answers,
  learningTime = 0,
  assessementTime = 0,
}) => {
  const data = useMemo(() => {
    const { list = [], possibleResponses = [] } = questions[0] || {}
    return list.map((item) => ({
      id: item.value,
      frontStimulus: item.label,
      backStimulus: possibleResponses.find((el) => el.value === item.value)
        ?.label,
    }))
  }, [questions])

  const [actualScore, totalScore] = useMemo(() => {
    const matchedPairs = Object.keys(answers?.[0] || {}).filter(
      (x) => !['wrongFlips', 'totalFlips'].includes(x)
    )
    const _actualScore = clamp(
      matchedPairs.length - answers?.[0]?.wrongFlips * 0.1,
      0,
      matchedPairs.length
    )

    const _totalScore = data.length

    return [_actualScore || 0, _totalScore || 0]
  }, [data, answers])

  const percent = useMemo(
    () => Math.round((actualScore / (totalScore || 1)) * 100),
    [actualScore, totalScore]
  )

  return (
    <FlashQuizReportContainer>
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        marginBottom="10px"
      >
        {user?.thumbnail ? (
          <AvatarContainer>
            <Avatar size={120} src={user.thumbnail} />
            <img className="badge" src={TrophyBadge} />
          </AvatarContainer>
        ) : (
          <Avatar size={100} style={{ fontSize: 36, fontWeight: 600 }}>
            {user?.username?.slice(0, 2)?.toUpperCase()}
          </Avatar>
        )}
        <StyledTag color="magenta">{user.username}</StyledTag>
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
              percent={percent}
              format={() => `${actualScore} / ${totalScore}`}
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
              percent={percent}
              format={(x) => `${x}%`}
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
              format={() => `${assessementTime + learningTime} Mins`}
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
              <StatValue>{answers?.[0]?.totalFlips || '-'}</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Total Wrong Flips">
              <StatValue>{answers?.[0]?.wrongFlips || '-'}</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Learning Time">
              <StatValue>{`${learningTime} mins`}</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Assessement Time">
              <StatValue>{`${assessementTime} mins`}</StatValue>
            </Descriptions.Item>
            <Descriptions.Item label="Total Time" span={2}>
              <StatValue>{`${learningTime + assessementTime} mins`}</StatValue>
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
