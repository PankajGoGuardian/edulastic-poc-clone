import React from 'react'
import { round, sumBy } from 'lodash'
import styled from 'styled-components'
import { ModalWrapper } from '../../../author/ExpressGrader/components/QuestionModal/styled'
import PerformanceTable from './Table'

const ChatGptModal = ({ setShowGptModal, showGptModal }) => {
  const data = [
    { type: 'Content', score: 80, weight: 20, metadata: {} },
    { type: 'Vocabulary', score: 40, weight: 30, metadata: {} },
    { type: 'Sentence Structure', score: 10, weight: 10, metadata: {} },
    { type: 'Spelling and Punctuation', score: 50, weight: 40, metadata: {} },
  ]
  const totalWeights = sumBy(data, 'weight')
  const overallScore = round(
    sumBy(data, ({ score, weight }) => score * weight) / totalWeights
  )
  return (
    <ModalWrapper
      centered
      width="60%"
      height="60%"
      footer={null}
      closable
      destroyOnClose
      onOk={() => setShowGptModal(false)}
      onCancel={() => setShowGptModal(false)}
      visible={showGptModal}
      bodyStyle={{
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <OverallScoreWrapper>Overall Score: {overallScore}%</OverallScoreWrapper>
      <Title>Score in each criteria:</Title>
      <PerformanceTable data={data} />
    </ModalWrapper>
  )
}

export default ChatGptModal

const OverallScoreWrapper = styled.div`
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  margin-block: 30px 20px;
`

const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
`
