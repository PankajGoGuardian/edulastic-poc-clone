import PropTypes from 'prop-types'
import React from 'react'

import VoiceRecorder from '../../../../../../assessment/widgets/AudioResponse/lib/VoiceRecorder'
import { isSubmitButton } from '../../../../common/helpers'
import AudioRecorder from './AudioRecorder'
import { StyledAudioElement } from '../../../../../../assessment/widgets/AudioResponse/styledComponents/AudioRecorder'
import { EduElse, EduIf, EduThen } from '@edulastic/common'

export default class FormAudio extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['edit', 'review', 'report']).isRequired,
    answer: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.voiceRecorder = React.createRef()
    this.voiceRecorder.current = new VoiceRecorder()
  }

  static defaultProps = {
    answer: '',
  }

  handleBlur = () => {
    // preventing blur event when relatedTarget is submit button
    const { saveQuestionResponse } = this.props
    saveQuestionResponse()
  }

  handleChange = (value) => {
    const { saveAnswer } = this.props
    saveAnswer(value)
    this.handleBlur()
  }

  renderView = () => {
    return <>Audio Response</>
  }

  renderForm = () => {
    const { answer } = this.props

    return (
      <>
        <EduIf condition={(answer || '').length > 0}>
          <EduThen>
            <StyledAudioElement
              src={answer}
              controls
              width="100%"
              height="32px"
              controlsList="nodownload noplaybackrate"
              preload="auto"
            />
          </EduThen>
          <EduElse>
            <AudioRecorder onFinish={this.handleChange} />
          </EduElse>
        </EduIf>
      </>
    )
  }

  renderReport = () => {
    const { answer } = this.props
    return (
      <>
        <StyledAudioElement
          src={answer}
          controls
          width="100%"
          height="32px"
          controlsList="nodownload noplaybackrate"
          preload="auto"
        />
      </>
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
