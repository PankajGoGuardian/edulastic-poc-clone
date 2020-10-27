import React, { useState, useEffect } from 'react'
import { round, toNumber, isNaN, isNull } from 'lodash'
import { TextInputStyled, notification } from '@edulastic/common'
import { connect } from 'react-redux'
import * as Sentry from '@sentry/browser'
import { StyledText } from './styled'

import { setTeacherEditedScore as setTeacherEditedScoreAction } from '../../ducks'
import { updateStudentQuestionActivityScoreAction } from '../../../sharedDucks/classResponses'
import { hasValidAnswers } from '../../../../assessment/utils/answer'

const QuestionScoreCell = ({
  studentScore,
  groupId,
  isGridEditOn,
  question,
  allAnswers,
  setTeacherEditedScore,
  updateQuestionActivityScore,
}) => {
  const [score, setScore] = useState(studentScore)
  const { graded, skipped } = question || {}
  useEffect(() => {
    setScore(studentScore)
  }, [isGridEditOn, studentScore])

  const handleChange = (e) => {
    setScore(e.target.value)
  }

  const handleBlur = () => {
    const updatedScore = toNumber(score)
    if (studentScore !== updatedScore) {
      if ((!updatedScore || isNaN(updatedScore)) && updatedScore != 0) {
        notification({ type: 'warn', messageKey: 'scoreShouldNumber' })
        setScore(studentScore)
        return
      }

      if (updatedScore > question.maxScore) {
        notification({ type: 'warn', messageKey: 'scoreShouldLess' })
        setScore(studentScore)
        return
      }
      const payload = {
        groupId,
        score: { score: updatedScore },
        testActivityId: question.testActivityId,
        questionId: question.id,
        itemId: question.testItemId,
        studentId: question.studentId,
      }

      setTeacherEditedScore({
        [question.id]: updatedScore,
      })

      if (payload.testActivityId && payload.itemId) {
        if (allAnswers[question.id]) {
          // adding user responses only when not empty
          if (hasValidAnswers(question?.qType, allAnswers[question.id])) {
            payload.userResponse = { [question.id]: allAnswers[question.id] }
          } else {
            const error = new Error('empty response update event')
            Sentry.configureScope((scope) => {
              scope.setExtra('qType', question?.qType)
              scope.setExtra('userResponse', allAnswers[question.id])
              Sentry.captureException(error)
            })
          }
        }
        updateQuestionActivityScore(payload)
      }
    }
  }

  if (!isGridEditOn) {
    return <StyledText>{graded || skipped ? round(score, 2) : '-'}</StyledText>
  }

  const getCellElement = (element) => {
    if (element.nodeName === 'TD' || element.nodeName === 'TH') {
      return element
    }
    return getCellElement(element.parentElement)
  }

  /**
   * @param {*} event KeyboardEvent from HTMLInputElement
   */
  const navigateGrid = (event) => {
    const { key, target } = event
    const currentCell = getCellElement(target)
    if (!currentCell) {
      return
    }

    let nextCell = null
    let nextInput = null

    if (key === 'ArrowLeft' && target.selectionStart === 0) {
      nextCell = currentCell.previousElementSibling
    } else if (key === 'ArrowUp') {
      const prevSibling = currentCell.parentElement.previousElementSibling
      if (!isNull(prevSibling)) {
        nextCell = prevSibling.cells[currentCell.cellIndex]
      }
    } else if (
      key === 'ArrowRight' &&
      target.selectionStart >= target.value.length
    ) {
      nextCell = currentCell.nextElementSibling
    } else if (key === 'ArrowDown') {
      const nextSibling = currentCell.parentElement.nextElementSibling
      if (!isNull(nextSibling)) {
        nextCell = nextSibling.cells[currentCell.cellIndex]
      }
    }

    if (!isNull(nextCell)) {
      nextInput = nextCell.querySelector('input')
    }

    if (!isNull(nextInput)) {
      target.blur()
      nextInput.focus()
    }
  }

  return (
    <TextInputStyled
      height="35px"
      borderRadius="0px"
      bg="transparent"
      align="center"
      value={score}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={navigateGrid}
    />
  )
}
const enhanced = connect(
  (state) => ({
    allAnswers: state.answers,
  }),
  {
    updateQuestionActivityScore: updateStudentQuestionActivityScoreAction,
    setTeacherEditedScore: setTeacherEditedScoreAction,
  }
)
export default enhanced(QuestionScoreCell)
