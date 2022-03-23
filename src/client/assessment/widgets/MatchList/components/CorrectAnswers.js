import React, { Fragment } from 'react'
import { FlexContainer, CorItem, MathFormulaDisplay } from '@edulastic/common'
import { StyledCorrectAnswersContainer } from '../styled/StyledCorrectAnswersContainer'
import { CorTitle } from '../styled/CorTitle'
import { Separator } from '../styled/Separator'
import { Index } from '../styled/Index'
import {
  AltScoreContainer,
  AltAnswersContainer,
  AltAnswerBlock,
  ScoreLabel,
} from '../styled/AltAnswerBlock'
import { getStemNumeration } from '../../../utils/helpers'

const CorrectAnswers = ({
  t,
  list,
  alternateAnswers,
  smallSize,
  allItemsById,
  validResponse,
  isPrintPreview,
  horizontallyAligned,
  stemNumeration,
  showAnswerScore,
  validRespScore,
  altRespScores,
}) => {
  const correctAnswerBoxStyle = {
    width: isPrintPreview ? '100%' : horizontallyAligned ? 1050 : 750,
  }

  const hasAlternateAnswers = Object.keys(alternateAnswers).length > 0

  return (
    <>
      <StyledCorrectAnswersContainer
        className="__prevent-page-break"
        title={t('component.matchList.correctAnswers')}
        style={correctAnswerBoxStyle}
        titleMargin="0px 0px 20px"
        showAnswerScore={showAnswerScore}
        score={validRespScore}
      >
        {list.map((ite, i) => (
          <FlexContainer
            key={i}
            marginBottom="10px"
            alignItems="center"
            marginLeft="20px"
          >
            <CorTitle>
              <MathFormulaDisplay
                dangerouslySetInnerHTML={{ __html: ite.label }}
              />
            </CorTitle>
            <Separator smallSize={smallSize} correctAnswer />
            <CorItem>
              <Index preview correctAnswer>
                {getStemNumeration(stemNumeration, i)}
              </Index>
              <MathFormulaDisplay
                choice
                dangerouslySetInnerHTML={{
                  __html:
                    allItemsById?.[validResponse[list[i].value]]?.label || '',
                }}
              />
            </CorItem>
          </FlexContainer>
        ))}
      </StyledCorrectAnswersContainer>

      {hasAlternateAnswers && (
        <StyledCorrectAnswersContainer
          className="__prevent-page-break"
          title={t('component.matchList.alternateAnswers')}
          style={correctAnswerBoxStyle}
          titleMargin="0px 0px 20px"
          showAnswerScore={showAnswerScore}
        >
          {showAnswerScore && (
            <AltScoreContainer>
              <ScoreLabel
                preview
                correctAnswer
                showAnswerScore={showAnswerScore}
              >
                Score
              </ScoreLabel>
              {altRespScores.map((score, index) => (
                <AltAnswerBlock key={index}>{score}</AltAnswerBlock>
              ))}
            </AltScoreContainer>
          )}
          {list.map((ite, i) => (
            <FlexContainer
              key={i}
              marginBottom="10px"
              alignItems="center"
              marginLeft="20px"
            >
              <CorTitle>
                <MathFormulaDisplay
                  dangerouslySetInnerHTML={{ __html: ite.label }}
                />
              </CorTitle>
              <Separator smallSize={smallSize} correctAnswer />
              <CorItem>
                <ScoreLabel
                  preview
                  correctAnswer
                  showAnswerScore={showAnswerScore}
                >
                  {getStemNumeration(stemNumeration, i)}
                </ScoreLabel>
                <AltAnswersContainer>
                  {alternateAnswers[ite.value].map((ans, index) => (
                    <AltAnswerBlock key={index}>
                      <MathFormulaDisplay
                        dangerouslySetInnerHTML={{
                          __html: ans || '',
                        }}
                      />
                    </AltAnswerBlock>
                  ))}
                </AltAnswersContainer>
              </CorItem>
            </FlexContainer>
          ))}
        </StyledCorrectAnswersContainer>
      )}
    </>
  )
}

export default CorrectAnswers
