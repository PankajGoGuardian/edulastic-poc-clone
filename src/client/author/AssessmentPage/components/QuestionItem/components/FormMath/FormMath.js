import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'

import { MathSpan, MathInput, EduIf, Stimulus } from '@edulastic/common'
import { themes } from '../../../../../../theme'
import { QuestionText } from '../../common/Form'
import { isSubmitButton } from '../../../../common/helpers'

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
    const { isSnapQuizVideo } = this.props
    return isSnapQuizVideo
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
          <Stimulus
            style={{ marginBottom: 10, minHeight: 32 }}
            dangerouslySetInnerHTML={{ __html: stimulus }}
          />
        </EduIf>
      )
    }

    return (
      <div>
        <EduIf condition={this.showStimulus}>
          <Stimulus
            style={{ marginBottom: 10, minHeight: 32 }}
            dangerouslySetInnerHTML={{ __html: stimulus }}
          />
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
          <Stimulus
            style={{ marginBottom: 10 }}
            dangerouslySetInnerHTML={{ __html: stimulus }}
          />
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
