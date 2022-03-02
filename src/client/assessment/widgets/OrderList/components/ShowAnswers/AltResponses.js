import React from 'react'
import styled from 'styled-components'
import {
  Subtitle,
  MathFormulaDisplay,
  CorrectAnswersContainer,
} from '@edulastic/common'
import { chunk } from 'lodash'
import { getStemNumeration } from '../../../../utils/helpers'
import { IndexBox } from '../OrderListPreview/styled/IndexBox'
import { Text } from '../OrderListPreview/styled/Text'
import { AnswerContent, sortAnswers } from './CorrectResponse'

const { ScoreBlock } = CorrectAnswersContainer

const AltResponses = ({
  smallSize,
  stemNumeration,
  altResponses,
  options,
  showAnswerScore,
  listItemStyle,
  fontSize,
}) => {
  const sorted = altResponses.map((altResp) => {
    return {
      score: altResp.score,
      value: sortAnswers(altResp.value),
    }
  })

  const blocks = chunk(altResponses, 3)
  const numOfRows = Object.keys(options).length + 1
  const rows = Array(numOfRows).fill(true)
  const columns = Array(4).fill(true)

  return (
    <AltRespContainer>
      {blocks.map((blcok, blockIndex) => {
        return (
          <AltRespBlock key={`altresp_row_${blockIndex}`}>
            {rows.map((_, rowIndex) => {
              if (rowIndex === 0 && !showAnswerScore) {
                return null
              }
              return columns.map((__, colIndex) => {
                const compKey = `${blockIndex}_${rowIndex}_${colIndex}`
                const altRespIndex = blockIndex * 3 + colIndex - 1
                const altResp = sorted[altRespIndex]

                if (rowIndex === 0 && colIndex === 0) {
                  return <AltRespLabel key={compKey}>Score</AltRespLabel>
                }
                if (colIndex === 0) {
                  return (
                    <AltIndexBox
                      showAnswer
                      key={compKey}
                      smallSize={smallSize}
                      {...listItemStyle}
                    >
                      {getStemNumeration(stemNumeration, rowIndex - 1)}
                    </AltIndexBox>
                  )
                }
                if (rowIndex === 0) {
                  return altResp ? (
                    <AnswerScoreBlock key={compKey}>
                      {altResp.score}
                    </AnswerScoreBlock>
                  ) : (
                    <div />
                  )
                }
                if (!altResp) {
                  return <div />
                }
                const optId = altResp?.value?.[rowIndex - 1]?.id
                return optId ? (
                  <AltText
                    key={compKey}
                    showAnswer
                    smallSize={smallSize}
                    {...listItemStyle}
                  >
                    <MathFormulaDisplay
                      style={{ margin: 'auto' }}
                      fontSize={fontSize}
                      dangerouslySetInnerHTML={{ __html: options[optId] || '' }}
                    />
                  </AltText>
                ) : (
                  <div />
                )
              })
            })}
          </AltRespBlock>
        )
      })}
    </AltRespContainer>
  )
}

export default AltResponses

const AltRespContainer = styled(AnswerContent)`
  display: grid;
  gap: 14px;
`

const AltRespBlock = styled.div`
  align-items: stretch;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(4, fit-content(30%));
`

const AltRespLabel = styled(Subtitle)`
  padding: 8px 0px;
  text-transform: initial;
  width: ${({ direction }) => (direction ? '100%' : '')};
`

const AnswerScoreBlock = styled(ScoreBlock)`
  margin-left: 0px;
  width: auto;
  min-width: 60px;
  font-size: ${({ theme }) => theme.smallFontSize};
  color: ${({ theme }) => theme.questionTextColor};
`

const AltIndexBox = styled(IndexBox)`
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: ${({ minHeight }) => minHeight}px;
`

const AltText = styled(Text)`
  width: auto;
  text-align: center;
  padding: 0px;
`
