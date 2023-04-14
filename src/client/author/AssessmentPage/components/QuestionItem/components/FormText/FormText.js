import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'

import { QuestionText } from '../../common/Form'
import { isSubmitButton } from '../../../../common/helpers'

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
      question: { validation },
    } = this.props

    if (!validation) return this.renderForm()

    const {
      validResponse: { value },
    } = validation

    if (!value || !value.length) return this.renderAnswerCreateForm()

    return <QuestionText>{value}</QuestionText>
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
    } = this.props
    return (
      <Input
        size="large"
        value={answer}
        data-cy="textInput"
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        ref={(el) => highlighted && !disableAutoHightlight && el?.focus()}
      />
    )
  }

  renderReport = () => {
    const { answer, view } = this.props
    return (
      <QuestionText check={['check', 'show'].includes(view)}>
        {answer}
      </QuestionText>
    )
  }

  renderAnswerCreateForm = () => {
    const {
      question: { id, type },
      onCreateAnswer,
      highlighted = false,
    } = this.props

    return (
      <Input
        size="large"
        onPressEnter={onCreateAnswer(id, type)}
        ref={(el) => highlighted && el?.focus()}
      />
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
