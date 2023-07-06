import React from 'react'
import PropTypes from 'prop-types'
import { Input, Radio } from 'antd'
import { isUndefined } from 'lodash'
import { EduIf, helpers } from '@edulastic/common'

import { QuestionOption, QuestionChunk } from '../../common/Form'
import { StimulusContainer } from '../../styled'
import { videoQuizStimulusSupportedQtypes } from '../../../Questions/constants'

export default class FormChoice extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['edit', 'review', 'report']).isRequired,
    question: PropTypes.object.isRequired,
    onCreateOptions: PropTypes.func.isRequired,
    evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    answer: PropTypes.array,
  }

  static defaultProps = {
    evaluation: undefined,
    answer: [],
  }

  handleSelect = (nextValue) => () => {
    const {
      question: { multipleResponses },
      answer,
      saveQuestionResponse,
    } = this.props

    if (!multipleResponses) {
      this.saveValue([nextValue])
      saveQuestionResponse()
      return
    }

    const valueIndex = answer.findIndex((v) => v === nextValue)
    const toggledValue = [...answer]

    if (valueIndex > -1) {
      toggledValue.splice(valueIndex, 1)
    } else {
      toggledValue.push(nextValue)
      toggledValue.sort()
    }

    this.saveValue(toggledValue)
    saveQuestionResponse()
  }

  saveValue = (currentValue) => {
    const { saveAnswer } = this.props
    saveAnswer(currentValue)
  }

  getOptionLabel = (index) => helpers.getNumeration(index, 'uppercase')

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

  get shouldModifyLabel() {
    const {
      question: { type },
      isSnapQuizVideo,
    } = this.props

    return isSnapQuizVideo && videoQuizStimulusSupportedQtypes.includes(type)
  }

  renderRadioForm = (chosenValue, handleChange = () => {}) => {
    const {
      question: { options },
    } = this.props

    const radioStyle = {
      marginLeft: '2px',
      paddingLeft: '2px',
    }

    return (
      <QuestionChunk
        data-cy="truOrFalse"
        tabIndex="0"
        onMouseDown={(e) => e && e.preventDefault()}
      >
        <Radio.Group onChange={handleChange} value={chosenValue[0]}>
          <Radio style={radioStyle} value={options[0].value}>
            {options[0].label}
          </Radio>
          <Radio style={radioStyle} value={options[1].value}>
            {options[1].label}
          </Radio>
        </Radio.Group>
      </QuestionChunk>
    )
  }

  renderView = () => {
    const {
      question: {
        options,
        multipleResponses,
        validation: {
          validResponse: { value },
        },
        stimulus = '',
      },
      isTrueOrFalse,
    } = this.props

    if (isTrueOrFalse) return this.renderRadioForm(value)

    if (!options.length) return this.renderOptionsCreateForm()

    return (
      <QuestionChunk>
        <EduIf condition={this.showStimulus}>
          <StimulusContainer>{stimulus}</StimulusContainer>
        </EduIf>
        {options.map(({ label, value: v }, key) => (
          <QuestionOption
            key={label + key}
            selected={value.includes(v)}
            multipleResponses={multipleResponses}
          >
            {this.shouldModifyLabel ? this.getOptionLabel(key) : label}
          </QuestionOption>
        ))}
      </QuestionChunk>
    )
  }

  renderForm = (mode) => {
    const {
      question: { options, multipleResponses, stimulus = '' },
      evaluation,
      view,
      answer,
      isTrueOrFalse,
    } = this.props

    const onChangeHandler = (e) => this.handleSelect(e.target.value)()

    if (isTrueOrFalse) return this.renderRadioForm(answer, onChangeHandler)

    const getCorrect = (value) => {
      if (!multipleResponses) {
        return answer.includes(value) && evaluation[0]
      }

      const valueIndex = answer.findIndex((item) => item === value)

      if (valueIndex > -1) {
        return evaluation[valueIndex]
      }

      return false
    }

    return (
      <QuestionChunk data-cy="mcqChoice">
        <EduIf condition={this.showStimulus}>
          <StimulusContainer>{stimulus}</StimulusContainer>
        </EduIf>
        {options.map(({ label, value }, key) => {
          const _label = this.shouldModifyLabel
            ? this.getOptionLabel(key)
            : label
          return (
            <QuestionOption
              tabIndex="0"
              mode={mode}
              data-cy="choiceOption"
              key={`form-${_label}-${key}`}
              selected={answer.includes(value)}
              correct={evaluation && getCorrect(value)}
              checked={!isUndefined(evaluation) && view !== 'clear'}
              onClick={mode === 'report' ? '' : this.handleSelect(value)}
              review
              multipleResponses={multipleResponses}
              onMouseDown={(e) => e && e.preventDefault()}
              onKeyDown={(e) => {
                const code = e.which
                if (code === 13 || code === 32) {
                  if (mode !== 'report') {
                    this.handleSelect(value)()
                  }
                }
              }}
            >
              {_label}
            </QuestionOption>
          )
        })}
      </QuestionChunk>
    )
  }

  renderOptionsCreateForm = () => {
    const {
      question: { id, type },
      onCreateOptions,
    } = this.props

    return <Input size="large" onPressEnter={onCreateOptions(id, type)} />
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
