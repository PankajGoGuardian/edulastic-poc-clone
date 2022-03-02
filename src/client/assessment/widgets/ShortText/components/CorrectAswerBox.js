import React from 'react'
import { get, isEmpty, chunk } from 'lodash'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { CorrectAnswersContainer, Subtitle } from '@edulastic/common'

const { ScoreBlock } = CorrectAnswersContainer

const AlternateAnswer = ({ showAnswerScore, index, anwser }) => {
  return (
    <AltAnswerRow showAnswerScore={showAnswerScore}>
      {index === 1 && (
        <>
          <div />
          <AltAnswerTitle direction="row">Answer</AltAnswerTitle>
          {showAnswerScore && (
            <AltAnswerTitle direction="row">Score</AltAnswerTitle>
          )}
        </>
      )}
      <AltAnswerTitle>{`Answer ${index}`}</AltAnswerTitle>
      <AnswerBlock>{anwser?.value}</AnswerBlock>
      {showAnswerScore && <AnswerBlock>{anwser.score}</AnswerBlock>}
    </AltAnswerRow>
  )
}

const CorrectAswerBox = ({ t, showAnswerScore, validation }) => {
  const validResponse = get(validation, 'validResponse', {})
  const altResponses = get(validation, 'altResponses', [])

  return (
    <Container data-cy="shortText-correctAnswers">
      <CorrectAnswersContainer
        title={t('component.shortText.correctAnswers')}
        minHeight="auto"
        padding="15px 25px 20px"
        showAnswerScore={showAnswerScore}
        score={validResponse.score}
      >
        <AnswerContent>
          <AnswerBlock>{validResponse.value}</AnswerBlock>
        </AnswerContent>
      </CorrectAnswersContainer>

      {!isEmpty(altResponses) && (
        <CorrectAnswersContainer
          title={t('component.shortText.alternateAnswers')}
          minHeight="auto"
          padding="15px 25px 20px"
        >
          <AltAnswerContent>
            {chunk(altResponses, 3).map((altRow, rowIndex) => (
              <div key={`altanswer_row_${rowIndex}`}>
                {altRow.map((altAns, ansIndex) => (
                  <AlternateAnswer
                    anwser={altAns}
                    index={rowIndex * 3 + ansIndex + 1}
                    key={`altanswer_${ansIndex}`}
                    showAnswerScore={showAnswerScore}
                  />
                ))}
              </div>
            ))}
          </AltAnswerContent>
        </CorrectAnswersContainer>
      )}
    </Container>
  )
}

export default withNamespaces('assessment')(CorrectAswerBox)

const Container = styled.div`
  position: relative;
`

const AnswerContent = styled.div`
  padding-left: 20px;
`

const AltAnswerContent = styled(AnswerContent)`
  display: grid;
  gap: 14px;
`

const AltAnswerRow = styled.div`
  display: grid;
  align-items: center;
  gap: 12px;
  padding-left: 8px;
  grid-template-columns: ${({ showAnswerScore }) =>
    showAnswerScore
      ? '50px fit-content(60%) fit-content(60%)'
      : '50px fit-content(60%)'};
  margin-top: 8px;

  &:first-child {
    margin-top: 0px;
  }
`

const AltAnswerTitle = styled(Subtitle)`
  padding: 0px;
  text-transform: initial;
  width: ${({ direction }) => (direction ? '100%' : '')};
`

const AnswerBlock = styled(ScoreBlock)`
  margin-left: 0px;
  width: auto;
  min-width: 60px;
  font-size: ${({ theme }) => theme.smallFontSize};
  color: ${({ theme }) => theme.questionTextColor};
`
