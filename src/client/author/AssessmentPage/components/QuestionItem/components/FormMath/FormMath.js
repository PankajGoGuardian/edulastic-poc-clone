import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'

import { MathSpan, MathInput, EduIf } from '@edulastic/common'
import { themes } from '../../../../../../theme'
import { QuestionText } from '../../common/Form'
import { isSubmitButton } from '../../../../common/helpers'
import { videoQuizStimulusSupportedQtypes } from '../../../Questions/constants'
import { StimulusContainer } from '../../styled'

export default class FormMath extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['edit', 'review', 'report']).isRequired,
    question: PropTypes.object.isRequired,
    answer: PropTypes.string,
  }

  static defaultProps = {
    answer: '',
  }

  get showStimulus() {
    const {
      question: { stimulus = '', type },
      isSnapQuizVideo,
      isSnapQuizVideoPlayer = false,
      showStimulusInQuestionItem,
    } = this.props

    return (
      showStimulusInQuestionItem &&
      !isSnapQuizVideoPlayer &&
      isSnapQuizVideo &&
      videoQuizStimulusSupportedQtypes.includes(type) &&
      stimulus?.length
    )
  }

  handleChange = (value, resetHighlighted = false) => {
    const { saveAnswer, clearHighlighted } = this.props
    /**
     * @see https://snapwiz.atlassian.net/browse/EV-35019
     * clear "highlighted" variable to avoid setting focus to math-input once again.
     */
    if (resetHighlighted) {
      clearHighlighted()
    }
    saveAnswer(value)
  }

  renderView = () => {
    const {
      question: { validation, stimulus = '' },
    } = this.props

    if (!validation) return this.renderForm()

    const {
      validResponse: { value },
    } = validation
    const answer = value[0]

    if (!answer || !answer.value) {
      return (
        <EduIf condition={this.showStimulus}>
          <StimulusContainer>{stimulus}</StimulusContainer>
        </EduIf>
      )
    }

    return (
      <div>
        <EduIf condition={this.showStimulus}>
          <StimulusContainer>{stimulus}</StimulusContainer>
        </EduIf>
        <QuestionText>
          <MathSpan
            dangerouslySetInnerHTML={{
              __html: `<span class="input__math" data-latex="${answer.value}"></span>`,
            }}
          />
        </QuestionText>
      </div>
    )
  }

  handleBlur = (ev) => {
    // preventing blur event when relatedTarget is submit button
    if (!isSubmitButton(ev)) {
      const { clearHighlighted, saveQuestionResponse } = this.props
      clearHighlighted()
      saveQuestionResponse()
    }
  }

  renderForm = (mode) => {
    const {
      question: {
        numberPad,
        symbols,
        allowedVariables = '',
        allowNumericOnly = false,
        stimulus = '',
      },
      answer,
      view,
      highlighted,
    } = this.props

    const restrictKeys =
      (allowedVariables || '')
        .split(',')
        .map((val) => val.trim())
        .filter((av) => !!av) || []

    if (mode === 'report') {
      return <QuestionText>{answer}</QuestionText>
    }
    return (
      <div>
        <EduIf condition={this.showStimulus}>
          <StimulusContainer>{stimulus}</StimulusContainer>
        </EduIf>
        <ThemeProvider theme={themes.default}>
          <MathInput
            onInput={this.handleChange}
            numberPad={numberPad}
            symbols={symbols}
            check={['check', 'show'].includes(view)}
            value={answer}
            fullWidth
            ref={(el) => highlighted && el?.setFocus()}
            onBlur={this.handleBlur}
            restrictKeys={restrictKeys}
            allowNumericOnly={allowNumericOnly}
            isFromDocBased
          />
        </ThemeProvider>
      </div>
    )
  }

  renderReport = () => {
    const { answer } = this.props

    return (
      <QuestionText>
        <MathSpan
          dangerouslySetInnerHTML={{
            __html: `<span class="input__math" data-latex="${answer}"></span>`,
          }}
        />
      </QuestionText>
    )
  }

  render() {
    const { mode } = this.props

    switch (mode) {
      case 'edit':
        return this.renderView()
      case 'review':
        return this.renderForm()
      case 'report':
        return this.renderReport()
      default:
        return null
    }
  }
}
