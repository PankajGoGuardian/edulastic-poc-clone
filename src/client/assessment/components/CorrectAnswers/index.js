import { FlexContainer, PointBlockContext } from '@edulastic/common'
import UnscoredHelperText from '@edulastic/common/src/components/UnscoredHelperText'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { questionTitle } from '@edulastic/constants'
import { AlternateAnswerLink } from '../../styled/ButtonStyles'
import PointBlock from './PointBlock'
import AnswerTabs from './AnswerTabs'
import { Subtitle } from '../../styled/Subtitle'
import { updateScoreAndValidationAction } from '../../../author/QuestionEditor/ducks'
import { isPremiumUserSelector } from '../../../author/src/selectors/user'

const CorrectAnswers = ({
  t,
  onTabChange,
  onCloseTab,
  children,
  correctTab,
  options,
  fillSections,
  cleanSections,
  validation,
  onAdd,
  mixAndMatch,
  questionType,
  updateScoreAndValidation,
  isPremiumUser,
  ...rest
}) => {
  const { unscored = false } = validation || {}
  const hidingScoringBlock = useContext(PointBlockContext)
  const hidePoint = mixAndMatch && correctTab > 0

  const updateScoreOnBlur = (score) => {
    if (score < 0) {
      return
    }
    const points = parseFloat(score, 10)
    updateScoreAndValidation(points)
  }

  return (
    <div
      section="main"
      label={t('component.correctanswers.setcorrectanswers')}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(
          `${questionType}-${t('component.correctanswers.setcorrectanswers')}`
        )}
      >
        {t('component.correctanswers.setcorrectanswers')}
      </Subtitle>
      <FlexContainer justifyContent="space-between" marginBottom="16px">
        <FlexContainer flexDirection="column">
          <AnswerTabs
            mixAndMatch={mixAndMatch}
            onTabChange={onTabChange}
            onCloseTab={onCloseTab}
            correctTab={correctTab}
            validation={validation}
          />
          {!hidePoint && !hidingScoringBlock && (
            <PointBlock
              {...rest}
              correctAnsScore={validation?.validResponse?.score}
              unscored={unscored}
              updateScoreOnBlur={updateScoreOnBlur}
              isPremiumUser={isPremiumUser}
            />
          )}
          {unscored && <UnscoredHelperText />}
        </FlexContainer>
        {questionType !== questionTitle.MCQ_TRUE_OR_FALSE && !hidePoint && (
          <FlexContainer alignItems="flex-end">
            <AlternateAnswerLink
              onClick={onAdd}
              color="primary"
              variant="extendedFab"
              data-cy="alternate"
            >
              {`+ ${t('component.correctanswers.alternativeAnswer')}`}
            </AlternateAnswerLink>
          </FlexContainer>
        )}
      </FlexContainer>
      {children}
      {options}
    </div>
  )
}

CorrectAnswers.propTypes = {
  onTabChange: PropTypes.func.isRequired,
  onCloseTab: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired,
  children: PropTypes.any,
  correctTab: PropTypes.number.isRequired,
  options: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  questionType: PropTypes.string,
  hidePoint: PropTypes.bool,
}

CorrectAnswers.defaultProps = {
  options: null,
  children: undefined,
  hidePoint: false,
  fillSections: () => {},
  cleanSections: () => {},
  questionType: '',
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      isPremiumUser: isPremiumUserSelector(state),
    }),
    {
      updateScoreAndValidation: updateScoreAndValidationAction,
    }
  )
)

export default enhance(CorrectAnswers)
