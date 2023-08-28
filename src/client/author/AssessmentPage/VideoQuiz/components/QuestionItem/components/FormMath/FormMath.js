import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'

import { MathSpan, MathInput, Stimulus } from '@edulastic/common'
import { themes } from '../../../../../../../theme'
import { QuestionText } from '../../../../styled-components/QuestionItem'
import { isSubmitButton } from '../../../../utils/common'

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
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
      )
    }

    return (
      <div>
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
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
        <Stimulus
          style={{ marginBottom: 10 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
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
    const {
      answer,
      question: { stimulus = '' },
    } = this.props

    return (
      <div>
        <Stimulus
          style={{ marginBottom: 20 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
        <QuestionText>
          <MathSpan
            dangerouslySetInnerHTML={{
              __html: `<span class="input__math" data-latex="${answer}"></span>`,
            }}
          />
        </QuestionText>
      </div>
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
