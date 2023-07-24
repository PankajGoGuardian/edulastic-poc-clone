import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { EduIf, Stimulus } from '@edulastic/common'

import { Dropdown } from './styled'

export default class FormDropdown extends React.Component {
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

  handleChange = (value) => {
    const { saveAnswer, saveQuestionResponse } = this.props
    saveAnswer([{ value, index: 0, id: '0' }])
    saveQuestionResponse()
  }

  renderView = () => {
    const {
      question: {
        options,
        validation: {
          validResponse: { value = [{}] },
        },
        stimulus = '',
      },
      view,
    } = this.props

    return (
      <div style={{ width: '100%' }}>
        <EduIf condition={this.showStimulus}>
          <Stimulus
            style={{ marginBottom: 10, minHeight: 32 }}
            dangerouslySetInnerHTML={{ __html: stimulus }}
          />
        </EduIf>
        <Dropdown
          value={(value[0] && value[0].value) || ''}
          check={['check', 'show'].includes(view)}
          onChange={this.handleChange}
          disabled
        >
          {options[0].map((option, key) => (
            <Select.Option
              key={`dropdown-form-${option}-${key}`}
              value={option}
            >
              {option}
            </Select.Option>
          ))}
        </Dropdown>
      </div>
    )
  }

  renderForm = (mode) => {
    const {
      question: { options, stimulus = '' },
      answer = [],
      clearHighlighted,
    } = this.props

    return (
      <div style={{ width: '100%' }}>
        <EduIf condition={this.showStimulus && mode !== 'report'}>
          <Stimulus
            style={{ marginBottom: 10, minHeight: 32 }}
            dangerouslySetInnerHTML={{ __html: stimulus }}
          />
        </EduIf>
        <Dropdown
          disabled={mode === 'report'}
          value={(answer[0] && answer[0].value) || ''}
          onChange={this.handleChange}
          data-cy="answerDropdown"
          onBlur={clearHighlighted}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          {options[0].map((option, key) => (
            <Select.Option
              key={`dropdown-form-${option}-${key}`}
              value={option}
            >
              {option}
            </Select.Option>
          ))}
        </Dropdown>
      </div>
    )
  }

  render() {
    const { mode } = this.props

    switch (mode) {
      case 'edit':
        return this.renderView()
      case 'review':
      case 'report':
        return this.renderForm(mode)
      default:
        return null
    }
  }
}
