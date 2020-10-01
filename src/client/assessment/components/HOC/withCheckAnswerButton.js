import React, { useState, Fragment, useEffect } from 'react'
import { connect } from 'react-redux'

import { EduButton } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'

import { checkAnswerAction } from '../../../author/src/actions/testItem'
import { changePreviewAction } from '../../../author/src/actions/view'
import { CHECK } from '../../constants/constantsForQuestions'

export const withCheckAnswerButton = (WrappedComponent) => {
  const hocComponent = ({
    item,
    userAnswer,
    checkAnswerAction,
    changeMode,
    t,
    ...restProps
  }) => {
    const initial = item ? item.feedback_attempts || null : null
    const [attempts, setAttempts] = useState(initial)

    useEffect(() => {
      if (attempts !== null && attempts !== initial) {
        checkAnswerAction()
        changeMode(CHECK)
      }
    }, [attempts])

    const checkAnswers = () => {
      if (Array.isArray(userAnswer) && userAnswer.length > 0) {
        setAttempts(attempts - 1)
      }
    }

    return (
      <>
        <WrappedComponent item={item} userAnswer={userAnswer} {...restProps} />
        {item && item.instant_feedback && (
          <>
            <br />
            <EduButton onClick={checkAnswers} disabled={attempts === 0}>
              {t('component.options.check_answer')}
            </EduButton>
          </>
        )}
      </>
    )
  }

  return withNamespaces('assessment')(
    connect(() => ({}), { checkAnswerAction, changeMode: changePreviewAction })(
      hocComponent
    )
  )
}
