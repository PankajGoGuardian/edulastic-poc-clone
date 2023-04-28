import React, { useMemo, useState } from 'react'
import { get, round } from 'lodash'
import styled from 'styled-components'
import { getGptEvaluateResponse } from '@edulastic/api/src/hackathon'
import {
  EduElse,
  EduIf,
  EduThen,
  SpinLoader,
  useApiQuery,
} from '@edulastic/common'
import { Empty } from 'antd'
import {
  lightGreen14,
  themeColor,
  themeColorBlue,
  yellow3,
} from '@edulastic/colors'
import { ModalWrapper } from '../../../author/ExpressGrader/components/QuestionModal/styled'
import PerformanceTable from './Table'
import gptLogo from './report-3.png'
import { formatName } from './utils'

const ChatGptModal = ({ studentQuestion, setShowGptModal, showGptModal }) => {
  const [overallScore, setOverallScore] = useState(0)

  const query = useMemo(
    () => ({
      userQuestionActivityId: studentQuestion?.[0]?._id,
    }),
    [studentQuestion?.[0]?._id]
  )

  const { data, loading, error } = useApiQuery(
    getGptEvaluateResponse,
    [query],
    { enabled: !!studentQuestion?.[0]?._id }
  )

  const tableData = get(data, 'data.result.evaluationCriteria', [])

  const maxScore = studentQuestion?.[0]?.maxScore

  const actualScore = round((overallScore * maxScore) / 100, 2)

  let color = yellow3
  if (overallScore > 70) color = lightGreen14
  else if (overallScore < 30) color = '#FF5C5C'

  return (
    <ModalWrapper
      centered
      width="50%"
      height="90%"
      footer={null}
      closable
      destroyOnClose
      onOk={() => setShowGptModal(false)}
      onCancel={() => setShowGptModal(false)}
      visible={showGptModal}
      bodyStyle={{
        height: '100%',
        overflowY: 'auto',
        padding: '15px 30px 30px 30px',
      }}
    >
      <EduIf condition={loading}>
        <EduThen>
          <SpinLoader
            tip="Evaluating Student Response"
            height="100%"
            position="relative"
          />
        </EduThen>
        <EduElse>
          <EduIf condition={tableData.length && !error}>
            <EduThen>
              <Header>
                <div className="image">
                  <img src={gptLogo} width="25px" height="25px" alt="" />
                  &nbsp;&nbsp;
                </div>
                <div className="main">
                  <span className="main-main">Smart</span>Grader:
                </div>
                <div className="sub">
                  &nbsp;&nbsp; The AI-Powered Grading Assistant
                </div>
                <Tag
                  style={{
                    position: 'relative',
                    left: 5,
                    top: 0,
                    backgroundColor: 'inherit',
                    border: `1.5px solid ${themeColorBlue}`,
                    color: themeColorBlue,
                  }}
                >
                  BETA
                </Tag>
              </Header>
              <OverallScoreWrapper>
                <div className="title-score">
                  <div className="title">Overall Score:&nbsp;&nbsp;</div>
                  <div className="overall-score">{`${overallScore}%`}</div>
                </div>
                <FlexBox column color={color}>
                  <ScoreWrapper color={color}>{actualScore}</ScoreWrapper>
                  <ScoreWrapper color="#ECECEC">{maxScore}</ScoreWrapper>
                </FlexBox>
              </OverallScoreWrapper>

              <Title>Score by Criteria</Title>
              <PerformanceTable
                data={tableData}
                setOverallScore={setOverallScore}
              />
              <Title>Feedback</Title>
              <Feedback>
                <ul>
                  {tableData.map((d) => (
                    <li>
                      <span className="title">{formatName(d.type)}:&nbsp;</span>
                      {d.metadata.feedback}
                    </li>
                  ))}
                </ul>
              </Feedback>
            </EduThen>
            <EduElse>
              <EduIf condition={studentQuestion?.userResponse}>
                <EduThen>
                  <Empty />
                </EduThen>
                <EduElse>
                  <Empty description="Not attempted by student" />
                </EduElse>
              </EduIf>
            </EduElse>
          </EduIf>
        </EduElse>
      </EduIf>
    </ModalWrapper>
  )
}

export default ChatGptModal

export const Tag = styled.div`
  position: absolute;
  height: 23px;
  width: 44px;
  background-color: #80ace9;
  color: #ffffff;
  margin-top: 5px;
  left: 20px;
  top: 20px;
  border-radius: 2px;
  font: normal normal bold 10px/14px Open Sans;
  letter-spacing: 0.19px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Feedback = styled.div`
  ul {
    list-style-type: square;
    li {
      .title {
        font-weight: 600;
        font-size: 14px;
      }
    }
  }
`

const Header = styled.div`
  display: flex;
  .image {
    margin-top: 4px;
  }
  .main {
    font-size: 20px;
    font-weight: bold;
    .main-main {
      color: ${themeColor};
    }
  }
  .sub {
    font-size: 17px;
    font-weight: 600;
    margin-top: 3px;
  }
`

const OverallScoreWrapper = styled.div`
  text-align: center;
  font-size: 20px;
  margin-inline: auto;
  margin-top: 30px;
  .title-score {
    display: flex;
  }
  .title {
    font-weight: 500;
  }
  .overall-score {
    font-weight: bold;
    align-items: center;
  }
  .actual-score {
    font-weight: 800;
  }
`

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-block: 15px;
`
const FlexBox = styled.div`
  display: flex;
  justify-content: center;
  border: 2px solid ${(p) => p.color};
  border-radius: 20px;
  overflow: hidden;
  white-space: nowrap;
  align-content: center;
  margin: 10px auto;
  ${(props) => props.column && 'flex-direction:column;'}
`
const ScoreWrapper = styled.div`
  text-align: center;
  padding: 10px;
  background-color: ${(p) => p.color};
  font-size: 20px;
  font-weight: bold;
`
