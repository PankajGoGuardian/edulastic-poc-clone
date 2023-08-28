import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { Stimulus } from '@edulastic/common'
import { isSubmitButton } from '../../../../utils/common'

export default class FormEssay extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['edit', 'review', 'report']).isRequired,
    question: PropTypes.object.isRequired,
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

    return (
      <div>
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
        <Input disabled placeholder="Essay type" />
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
      answer,
      question: {
        uiStyle: { numberOfRows = 10 },
        stimulus = '',
      },
      mode,
      highlighted,
      disableAutoHightlight,
    } = this.props
    return (
      <div>
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
        <Input.TextArea
          style={{ padding: '2px 11px', resize: 'none' }}
          value={answer}
          data-cy="essayInput"
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          disabled={mode === 'report'}
          rows={numberOfRows} // textarea number of rows
          ref={(el) => highlighted && !disableAutoHightlight && el?.focus()}
        />
      </div>
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
