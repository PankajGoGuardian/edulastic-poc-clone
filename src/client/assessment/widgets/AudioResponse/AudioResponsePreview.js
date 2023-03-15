import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import {
  QuestionNumberLabel,
  FlexContainer,
  QuestionSubLabel,
  EduIf,
} from '@edulastic/common'
import { StyledStimulus } from './styledComponents/AudioRecorder'
import { shouldUploadToS3AndUseS3Url, hideRecorder } from './utils'
import { getUserRole, getUserId } from '../../../author/src/selectors/user'
import {
  getAudioRecordingStateSelector,
  getAudioUploadStatusSelector,
  getStopAudioRecordingAndUploadForQidSelector,
} from '../../selectors/media'
import {
  getTestItemIdFromPropsSelector,
  getQuestionIdFromPropsSelector,
} from '../../selectors/answers'
import {
  setMediaRecordingStateAction,
  setMediaUploadStatusAction,
  setStopAudioRecordingAndUploadForQidAction,
  audioUploadCompleteForQidAction,
} from '../../actions/media'
import { StyledPaperWrapper } from '../../styled/Widget'
import Instructions from '../../components/Instructions'
import AudioResponseContainer from './components/AudioResponseContainer'

const AudioResponsePreview = ({
  t: i18translate,
  showQuestionNumber,
  flowLayout,
  item = {},
  smallSize,
  saveAnswer,
  userAnswer,
  inLCB,
  isStudentReport,
  isLCBView,
  userRole,
  userId,
  isTestPreviewModalVisible,
  isTestDemoPlayer,
  recordingState,
  audioUploadStatus,
  stopRecordingForQid,
  setRecordingState,
  setAudioUploadStatus,
  setStopAudioRecordingAndUploadForQid,
  recordingAndUploadCompleteForQid,
  _questionId: questionId,
  _testItemId: itemId,
  disableResponse,
}) => {
  const useS3AudioUrl = useMemo(() => {
    return shouldUploadToS3AndUseS3Url({
      userRole,
      isTestPreviewModalVisible,
      isTestDemoPlayer,
    })
  }, [userRole, isTestPreviewModalVisible, isTestDemoPlayer])

  const hideAudioRecorder = useMemo(() => {
    return hideRecorder({
      inLCB,
      isStudentReport,
      isLCBView,
    })
  }, [inLCB, isStudentReport, isLCBView])

  const { stimulus, qLabel, qSubLabel, audioTimeLimitInMinutes } = item

  const AudioPropPayload = {
    i18translate,
    audioTimeLimitInMinutes,
    useS3AudioUrl,
    saveAnswer,
    userAnswer,
    hideAudioRecorder,
    userId,
    recordingState,
    audioUploadStatus,
    stopRecordingForQid,
    setRecordingState,
    setAudioUploadStatus,
    setStopAudioRecordingAndUploadForQid,
    recordingAndUploadCompleteForQid,
    questionId,
    itemId,
    disableResponse,
  }

  return (
    <StyledPaperWrapper padding={smallSize} boxShadow={smallSize ? 'none' : ''}>
      <FlexContainer alignItems="flex-start" justifyContent="flex-start">
        <EduIf condition={!flowLayout}>
          <FlexContainer
            justifyContent="flex-start"
            flexDirection="column"
            alignItems="flex-start"
          >
            <EduIf condition={showQuestionNumber}>
              <QuestionNumberLabel className="__print-space-reduce-qlabel">
                {qLabel}
              </QuestionNumberLabel>
            </EduIf>
            {qSubLabel && <QuestionSubLabel>({qSubLabel})</QuestionSubLabel>}
          </FlexContainer>

          <FlexContainer
            width="100%"
            className="__print_question-content-wrapper"
            flexDirection="column"
            alignItems="flex-start"
            data-cy="question-content-wrapper"
          >
            <StyledStimulus
              dangerouslySetInnerHTML={{ __html: stimulus }}
              className="_print-space-reduce-stimulus"
            />
            <AudioResponseContainer {...AudioPropPayload} />
          </FlexContainer>
        </EduIf>
      </FlexContainer>
      <Instructions item={item} />
    </StyledPaperWrapper>
  )
}

AudioResponsePreview.propTypes = {
  t: PropTypes.func.isRequired,
  showQuestionNumber: PropTypes.number,
  flowLayout: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  smallSize: PropTypes.bool,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.string,
  inLCB: PropTypes.bool,
  isStudentReport: PropTypes.bool,
  isLCBView: PropTypes.bool,
  userRole: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  isTestPreviewModalVisible: PropTypes.bool,
  isTestDemoPlayer: PropTypes.bool,
  recordingState: PropTypes.string.isRequired,
  audioUploadStatus: PropTypes.string.isRequired,
  stopRecordingForQid: PropTypes.string.isRequired,
  setRecordingState: PropTypes.func.isRequired,
  setAudioUploadStatus: PropTypes.func.isRequired,
  setStopAudioRecordingAndUploadForQid: PropTypes.func.isRequired,
  recordingAndUploadCompleteForQid: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired,
  itemId: PropTypes.string,
  disableResponse: PropTypes.bool,
}

AudioResponsePreview.defaultProps = {
  userAnswer: '',
  showQuestionNumber: false,
  inLCB: false,
  isStudentReport: false,
  isLCBView: false,
  smallSize: false,
  isTestPreviewModalVisible: false,
  isTestDemoPlayer: false,
  itemId: 'new',
  disableResponse: false,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state, props) => ({
      userRole: getUserRole(state),
      userId: getUserId(state),
      recordingState: getAudioRecordingStateSelector(state, props),
      audioUploadStatus: getAudioUploadStatusSelector(state, props),
      stopRecordingForQid: getStopAudioRecordingAndUploadForQidSelector(state),
      _testItemId: getTestItemIdFromPropsSelector(state, props),
      _questionId: getQuestionIdFromPropsSelector(state, props),
    }),
    {
      setRecordingState: setMediaRecordingStateAction,
      setAudioUploadStatus: setMediaUploadStatusAction,
      setStopAudioRecordingAndUploadForQid: setStopAudioRecordingAndUploadForQidAction,
      recordingAndUploadCompleteForQid: audioUploadCompleteForQidAction,
    }
  )
)

export default enhance(AudioResponsePreview)
