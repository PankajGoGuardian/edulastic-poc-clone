import { correctIconColor, wrongIconColor, whiteSmoke } from '@edulastic/colors'
import React from 'react'
import { RightIcon, WrongIcon, PartialIcon } from '../styled/EvaluationIcons'

const correctObj = {
  fillColor: '#e2fcf3',
  mark: <RightIcon />,
  indexBgColor: correctIconColor,
}

const wrongObj = {
  fillColor: '#fde0e9',
  mark: <WrongIcon />,
  indexBgColor: wrongIconColor,
}

const partialObj1 = {
  fillColor: '#fbfae0',
  mark: <PartialIcon />,
  indexBgColor: '#bdb956',
}

const partialObj2 = {
  fillColor: '#fbfae0',
  mark: '',
  indexBgColor: '#bdb956',
}

const skippedObj = { fillColor: whiteSmoke, mark: '', indexBgColor: '#A7A7A7' }

export const getEvalautionColor = (
  answerScore,
  correct,
  attempt,
  allCorrect,
  isEvaluationEmpty = false
) => {
  const { score, isGradedExternally, itemLevelScoring, multipartItem } =
    answerScore || {}

  if (!attempt || isEvaluationEmpty) {
    // skipped answer
    return skippedObj
  }

  if (allCorrect && score < 1 && score > 0) {
    // its all correct, but score isn't maxScore
    return partialObj1
  }

  if (
    attempt &&
    correct &&
    itemLevelScoring &&
    multipartItem &&
    isGradedExternally
  ) {
    return correctObj
  }

  if (attempt && (!correct || (isGradedExternally && score === 0))) {
    if (isGradedExternally && score > 0) {
      // score changd manually, but its wrong
      return partialObj2
    }
    // its wrong answer
    return wrongObj
  }
  if (attempt && correct) {
    // got max score and its all correct
    return correctObj
  }

  return { fillColor: '', mark: '' }
}
