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

  state = {
    changed: false,
  }

  handleChange = ({ target: { value } }) => {
    const { saveAnswer } = this.props
    const { changed } = this.state
    saveAnswer(value)
    if (!changed) {
      this.setState({ changed: true })
    }
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
    const { changed } = this.state
    // preventing blur event when relatedTarget is submit button and there is no change in input value
    if (!isSubmitButton(ev) && changed) {
      const { clearHighlighted, saveQuestionResponse } = this.props
      clearHighlighted()
      saveQuestionResponse()
      this.setState({ changed: false })
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
