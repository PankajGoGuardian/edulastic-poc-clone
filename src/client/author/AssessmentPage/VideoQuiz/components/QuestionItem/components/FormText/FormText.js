import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { EduIf, Stimulus } from '@edulastic/common'

import { QuestionText } from '../../../../styled-components/QuestionItem'
import { isSubmitButton } from '../../../../utils/common'

export default class FormText extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['edit', 'review', 'report']).isRequired,
    question: PropTypes.object.isRequired,
    onCreateAnswer: PropTypes.func.isRequired,
    answer: PropTypes.string,
    disableAutoHightlight: PropTypes.bool,
  }

  static defaultProps = {
    disableAutoHightlight: false,
    answer: '',
  }

  handleChange = ({ target: { value } }) => {
    const { saveAnswer } = this.props
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

    if (!value || !value.length) return this.renderAnswerCreateForm()

    return (
      <div>
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
        <QuestionText>{value}</QuestionText>
      </div>
    )
  }

  handleBlur = (ev) => {
    // preventing blur event when relatedTarget is submit button
    if (!isSubmitButton(ev)) {
      const { clearHighlighted, saveQuestionResponse } = this.props
      clearHighlighted && clearHighlighted()
      saveQuestionResponse()
    }
  }

  renderForm = () => {
    const {
      answer = false,
      highlighted = false,
      disableAutoHightlight = false,
      question: { stimulus = '' },
    } = this.props

    return (
      <div>
        {' '}
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
        <Input
          size="large"
          value={answer}
          data-cy="textInput"
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          ref={(el) => highlighted && !disableAutoHightlight && el?.focus()}
        />
      </div>
    )
  }

  renderReport = () => {
    const {
      answer,
      view,
      question: { stimulus = '' },
    } = this.props
    return (
      <div>
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
        <QuestionText check={['check', 'show'].includes(view)}>
          {answer}
        </QuestionText>
      </div>
    )
  }

  renderAnswerCreateForm = () => {
    const {
      question: { id, type, stimulus },
      onCreateAnswer,
      highlighted = false,
      isSnapQuizVideoPlayer = false,
    } = this.props

    return (
      <div>
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
        <EduIf condition={!isSnapQuizVideoPlayer}>
          <Input
            size="large"
            onPressEnter={onCreateAnswer(id, type)}
            ref={(el) => highlighted && el?.focus()}
          />
        </EduIf>
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
