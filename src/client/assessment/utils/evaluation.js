import React from 'react'
import styled from 'styled-components'
import { IconCheck, IconClose } from '@edulastic/icons'
import { themeColor, darkRed } from '@edulastic/colors'

export const getEvalautionColor = (
  answerScore,
  correct,
  attempt,
  allCorrect
) => {
  const { score, isGradedExternally } = answerScore || {}
  if (!attempt) {
    // skipped answer
    return { fillColor: '#F5F5F5', mark: '', indexBgColor: '#A7A7A7' }
  }

  if (allCorrect && score < 1 && score > 0) {
    // its all correct, but score isn't maxScore
    return {
      fillColor: '#fbfae0',
      mark: <PartialIcon />,
      indexBgColor: '#bdb956',
    }
  }

  if (attempt && !correct) {
    if (isGradedExternally && score > 0) {
      // score changd manually, but its wrong
      return {
        fillColor: '#fbfae0',
        mark: '',
        indexBgColor: '#bdb956',
      }
    }
    // its wrong answer
    return {
      fillColor: '#fce0e8',
      mark: <WrongIcon />,
      indexBgColor: '#dd2e44',
    }
  }
  if (attempt && correct) {
    // got max score and its all correct
    return {
      fillColor: '#d3fea6',
      mark: <RightIcon />,
      indexBgColor: '#5eb500',
    }
  }

  return { fillColor: '', mark: '' }
}

const RightIcon = styled(IconCheck)`
  width: 10px;
  height: 10px;
  fill: ${themeColor};
  &:hover {
    fill: ${themeColor};
  }
`

const WrongIcon = styled(IconClose)`
  width: 8px;
  height: 8px;
  fill: ${darkRed};
  &:hover {
    fill: ${darkRed};
  }
`

const PartialIcon = styled(RightIcon)`
  fill: #dfd82c;
  &:hover {
    fill: #dfd82c;
  }
`
