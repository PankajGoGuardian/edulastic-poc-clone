import React, { useState } from 'react'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { Input, Row, Col, Tabs } from 'antd'
import styled from 'styled-components'

const { TextArea } = Input
const { TabPane } = Tabs

const data = [
  {
    questionDescription: 'question 1',
    answer: 'answer 1',
  },
  {
    questionDescription: 'question 2',
    answer: 'answer 2',
  },
  {
    questionDescription: 'question 1',
    answer: 'answer 1',
  },
  {
    questionDescription: 'question 2',
    answer: 'answer 2',
  },
  {
    questionDescription: 'question 2',
    answer: 'answer 2',
  },
  {
    questionDescription: 'question 1',
    answer: 'answer 1',
  },
  {
    questionDescription: 'question 2',
    answer: 'answer 2',
  },
  {
    questionDescription: 'question 1',
    answer: 'answer 1',
  },
  {
    questionDescription: 'question 2',
    answer: 'answer 2',
  },
  {
    questionDescription: 'question 1',
    answer: 'answer 1',
  },
  {
    questionDescription: 'question 2',
    answer: 'answer 2',
  },
  {
    questionDescription: 'question 2',
    answer: 'answer 2',
  },
  {
    questionDescription: 'question 1',
    answer: 'answer 1',
  },
  {
    questionDescription: 'question 2',
    answer: 'answer 2',
  },
]

const DoubtsModal = ({ isVisible, onCancel, onCreate }) => {
  const [questionText, setQuestionText] = useState('')

  const footer = (
    <>
      <EduButton data-cy="cancelButton" isGhost onClick={onCancel}>
        CANCEL
      </EduButton>
      <EduButton
        data-cy="applyButton"
        onClick={() => onCreate(questionText)}
        disabled={questionText.length === 0}
      >
        CREATE
      </EduButton>
    </>
  )
  return (
    <CustomModalStyled
      visible={isVisible}
      title="Doubts"
      onCancel={onCancel}
      footer={footer}
      centered
      width="800px"
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Ask your doubt" key="1">
          <Row>
            <Col>
              <TextArea
                rows={4}
                onChange={(e) => setQuestionText(e.target.value)}
                value={questionText}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Previously asked doubts" key="2">
          <StyledDiv>
            {data.map((d, index) => (
              <Row style={{ marginBottom: '10px' }}>
                <Col>
                  <p>
                    {index + 1}. {d.questionDescription}
                  </p>
                </Col>
                <AnswerCol>{d.answer}</AnswerCol>
              </Row>
            ))}
          </StyledDiv>
        </TabPane>
      </Tabs>
    </CustomModalStyled>
  )
}

export default DoubtsModal

const AnswerCol = styled(Col)`
  background: #d8d8d8;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
`

const StyledDiv = styled.div`
  max-height: 600px;
  overflow: auto;
  padding-right: 10px;
`
