import { FlexContainer } from '@edulastic/common'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { questionTitle } from '@edulastic/constants'
import { AlternateAnswerLink } from '../../styled/ButtonStyles'
import PointBlock from './PointBlock'
import AnswerTabs from './AnswerTabs'
import { Subtitle } from '../../styled/Subtitle'

class CorrectAnswers extends Component {
  get subtitleId() {
    const { t, questionType } = this.props
    return getFormattedAttrId(
      `${questionType}-${t('component.correctanswers.setcorrectanswers')}`
    )
  }

  render() {
    const {
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
      ...rest
    } = this.props
    const hidePoint = mixAndMatch && correctTab > 0

    return (
      <div
        section="main"
        label={t('component.correctanswers.setcorrectanswers')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={this.subtitleId}>
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
            {!hidePoint && (
              <PointBlock
                {...rest}
                correctAnsScore={validation?.validResponse?.score}
              />
            )}
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

export default withNamespaces('assessment')(CorrectAnswers)
