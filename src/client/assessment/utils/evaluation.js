import React from 'react'
import {
  correctIconColor,
  correctBgColor,
  wrongBgColor,
  wrongIconColor,
  skippedBgColor,
  skippedIconColor,
  partialBgColor,
  partialIconColor,
} from '@edulastic/colors'
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
    return {
      mark: '',
      fillColor: skippedBgColor,
      indexBgColor: skippedIconColor,
    }
  }

  if (allCorrect && score < 1 && score > 0) {
    // its all correct, but score isn't maxScore
    return {
      fillColor: partialBgColor,
      mark: <PartialIcon />,
      indexBgColor: partialIconColor,
    }
  }

  if (attempt && (!correct || (isGradedExternally && score === 0))) {
    if (isGradedExternally && score > 0) {
      // score changd manually, but its wrong
      return {
        fillColor: partialBgColor,
        mark: '',
        indexBgColor: partialIconColor,
      }
    }
    // its wrong answer
    return {
      fillColor: wrongBgColor,
      mark: <WrongIcon />,
      indexBgColor: wrongIconColor,
    }
  }
  if (attempt && correct) {
    // got max score and its all correct
    return {
      fillColor: correctBgColor,
      mark: <RightIcon />,
      indexBgColor: correctIconColor,
    }
  }

  return { fillColor: '', mark: '' }
}
