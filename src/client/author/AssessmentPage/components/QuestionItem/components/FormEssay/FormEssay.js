import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { isSubmitButton } from '../../../../common/helpers'

export default class FormEssay extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['edit', 'review', 'report']).isRequired,
    question: PropTypes.object.isRequired,
    answer: PropTypes.string,
  }

  static defaultProps = {
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

    return (
      <Input style={{ width: '150px' }} disabled placeholder="Essay type" />
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

  renderForm = () => {
    const {
      answer,
      question: {
        uiStyle: { numberOfRows = 10 },
      },
      mode,
      highlighted,
    } = this.props
    return (
      <Input.TextArea
        style={{ padding: '2px 11px', resize: 'none' }}
        value={answer}
        data-cy="essayInput"
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        disabled={mode === 'report'}
        rows={numberOfRows} // textarea number of rows
        ref={(el) => highlighted && el?.focus()}
      />
    )
  }

  render() {
    const { mode } = this.props
    switch (mode) {
      case 'edit':
        return this.renderView()
      case 'report':
      case 'review':
        return this.renderForm()
      default:
        return null
    }
  }
}
