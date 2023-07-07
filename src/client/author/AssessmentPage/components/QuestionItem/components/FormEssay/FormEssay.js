import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { EduIf } from '@edulastic/common'
import { isSubmitButton } from '../../../../common/helpers'
import { videoQuizStimulusSupportedQtypes } from '../../../Questions/constants'
import { StimulusContainer } from '../../styled'

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

  renderView = () => {
    const {
      question: { validation, stimulus = '' },
    } = this.props
    if (!validation) return this.renderForm()

    return (
      <div>
        <EduIf condition={this.showStimulus}>
          <StimulusContainer>{stimulus}</StimulusContainer>
        </EduIf>
        <Input style={{ width: '150px' }} disabled placeholder="Essay type" />
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
        <EduIf condition={this.showStimulus}>
          <StimulusContainer>{stimulus}</StimulusContainer>
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
        </EduIf>
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
