import React from 'react'
import { RightIcon, WrongIcon, PartialIcon } from '../styled/EvaluationIcons'

export const getEvalautionColor = (
  answerScore,
  correct,
  attempt,
  allCorrect,
  isEvaluationEmpty = false
) => {
  const { score, isGradedExternally } = answerScore || {}
  if (!attempt || isEvaluationEmpty) {
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

  if (attempt && (!correct || score === 0)) {
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
      fillColor: '#fde0e9',
      mark: <WrongIcon />,
      indexBgColor: '#f25783',
    }
  }
  if (attempt && correct) {
    // got max score and its all correct
    return {
      fillColor: '#e2fcf3',
      mark: <RightIcon />,
      indexBgColor: '#36d29c',
    }
  }

  return { fillColor: '', mark: '' }
}
