import {
  CustomModalStyled,
  EduButton,
  EduIf,
  FieldLabel,
  NumberInputStyled,
  SelectInputStyled,
  notification,
} from '@edulastic/common'
import {
  // CLOZE_DROP_DOWN,
  // ESSAY_PLAIN_TEXT,
  // MATH,
  MULTIPLE_CHOICE,
  // SHORT_TEXT,
  TRUE_OR_FALSE,
} from '@edulastic/constants/const/questionType'
import { Col, Icon, Row, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { segmentApi } from '@edulastic/api'
import { selectsData } from '../../../TestPage/components/common'
import {
  fetchAIGeneratedQuestionAction,
  setAIGeneratedQuestionStateAction,
} from '../../../src/actions/aiGenerateQuestion'
import { ModalFooter, ModalWrapper } from '../../common/Modal'
import {
  QuestionFormWrapper,
  StyledBetaTag,
} from '../styled-components/QuestionForm'
import StandardSet from './QuestionEditModal/common/StandardSet'
import { StandardSelectWrapper } from '../styled-components/StandardSet'
import { validateStandardsData } from '../utils/common'
import { standardsFields } from '../constants'

class AddBulkModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    minAvailableQuestionIndex: PropTypes.number.isRequired,
    onApply: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired,
  }

  state = {
    number: 2,
    type: MULTIPLE_CHOICE,
    authorDifficulty: '',
    depthOfKnowledge: '',
    alignment: [
      {
        curriculum: '',
        curriculumId: '',
        domains: [],
        grades: [],
        standards: [],
        subject: '',
      },
    ],
  }

  handleChange = (field) => (value) =>
    this.setState({
      [field]: value,
    })

  handleApply = (aiQuestions) => {
    const {
      number,
      type,
      alignment,
      authorDifficulty,
      depthOfKnowledge,
    } = this.state

    const { onApply, minAvailableQuestionIndex } = this.props

    if (aiQuestions) {
      onApply({
        number,
        type,
        startingIndex: minAvailableQuestionIndex,
        alignment,
        authorDifficulty,
        depthOfKnowledge,
        aiQuestions,
        isFromAddBulk: true,
      })
    } else {
      this.generateViaAI({ questionCount: number, questionType: type })
      segmentApi.genericEventTrack('GenerateAIItem', {
        source: 'Video Quiz: Generate',
      })
    }
  }

  generateViaAI = ({ questionCount, questionType }) => {
    const { alignment, authorDifficulty, depthOfKnowledge } = this.state
    const { questions } = this.props

    const { grades = [], standards = [], subject = '', curriculum = '' } =
      alignment?.[0] || {}

    const { isValid, message } = validateStandardsData({
      grades,
      subject,
      curriculum,
    })
    if (!isValid) {
      return notification({ type: 'warn', msg: message })
    }

    const curriculumStandardsIdsIdentifiers = []
    ;(standards || []).forEach((standard) => {
      curriculumStandardsIdsIdentifiers.push(standard?.identifier || '')
    })

    const { fetchAIGeneratedQuestion, videoUrl } = this.props
    fetchAIGeneratedQuestion({
      videoUrl,
      count: questionCount,
      questionType,
      difficultLevels: authorDifficulty?.length
        ? [authorDifficulty]
        : selectsData.allAuthorDifficulty
            .map((difficulty) => difficulty?.value || '')
            .filter((difficultyValue) => difficultyValue),
      depthsOfKnowledge: depthOfKnowledge?.length
        ? [depthOfKnowledge]
        : selectsData.allDepthOfKnowledge
            .map((dok) => dok?.value || '')
            .filter((dokValue) => dokValue),
      grades,
      subject,
      ...(curriculum?.length ? { standardSet: curriculum } : {}),
      commonCoreStandards: curriculumStandardsIdsIdentifiers,
      existingQuestions: questions
        ?.map(({ stimulus, questionDisplayTimestamp }) => ({
          name: stimulus,
          ...(questionDisplayTimestamp
            ? { displayAtSecond: questionDisplayTimestamp }
            : {}),
        }))
        .filter(({ name }) => name),
    })
  }

  componentDidUpdate = () => {
    const {
      aiGenerateQuestionState: { result, apiStatus } = {},
      setAIGeneratedQuestionState,
    } = this.props

    if (
      (result || []).length > 0 &&
      ['SUCCESS', 'FAILED'].includes(apiStatus)
    ) {
      this.handleApply(result || [])
      setAIGeneratedQuestionState({
        apiStatus: false,
        result: [],
      })
    }
  }

  componentDidMount = () => {
    const {
      aiGenerateQuestionState: { apiStatus } = {},
      setAIGeneratedQuestionState,
    } = this.props
    if (apiStatus) {
      setAIGeneratedQuestionState({
        apiStatus: false,
        result: [],
      })
    }
  }

  render() {
    const {
      number,
      type,
      alignment,
      authorDifficulty,
      depthOfKnowledge,
    } = this.state
    const {
      onCancel,
      visible,
      aiGenerateQuestionState: { apiStatus } = {},
    } = this.props

    const loading = apiStatus === 'INITIATED'

    return (
      <CustomModalStyled
        visible={visible}
        title={
          <>
            Auto Generate <StyledBetaTag alignItems="left">BETA</StyledBetaTag>
          </>
        }
        onCancel={onCancel}
        maskClosable={false}
        footer={[
          <ModalFooter marginTop="35px">
            <EduButton isGhost onClick={onCancel}>
              Cancel
            </EduButton>
            <EduButton
              disabled={loading}
              onClick={() => this.handleApply()}
              data-cy="apply"
            >
              Generate Questions
              <EduIf condition={loading}>
                <Spin size="small" indicator={<Icon type="loading" />} />
              </EduIf>
            </EduButton>
          </ModalFooter>,
        ]}
      >
        <ModalWrapper width="100%">
          <QuestionFormWrapper>
            <Row gutter={20}>
              <Col span={6}>
                <FieldLabel>Number</FieldLabel>
                <NumberInputStyled
                  min={1}
                  max={10}
                  value={number}
                  onChange={this.handleChange('number')}
                  data-cy="questionCount"
                />
              </Col>
              <Col span={18}>
                <FieldLabel>Type of Question</FieldLabel>
                <SelectInputStyled
                  value={type}
                  onChange={this.handleChange('type')}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  data-cy="questionType"
                >
                  <Select.Option value={MULTIPLE_CHOICE}>
                    Multiple Choice
                  </Select.Option>
                  {/* <Select.Option value={SHORT_TEXT}>Text</Select.Option> */}
                  {/* <Select.Option value={CLOZE_DROP_DOWN}>
                    Drop down
                  </Select.Option> */}
                  {/* <Select.Option value={MATH}>Math</Select.Option> */}
                  {/* <Select.Option value={ESSAY_PLAIN_TEXT}>Essay</Select.Option> */}
                  <Select.Option value={TRUE_OR_FALSE}>
                    True or False
                  </Select.Option>
                </SelectInputStyled>
              </Col>
            </Row>
          </QuestionFormWrapper>

          <StandardSelectWrapper>
            <StandardSet
              alignment={alignment}
              onUpdate={(data) => this.setState({ alignment: data.alignment })}
              isDocBased
              showIconBrowserBtn
              standardsRequiredFields={[
                standardsFields.SUBJECT,
                standardsFields.GRADES,
              ]}
              considerCustomAlignmentDataSettingPriority
            />
            <Row style={{ marginTop: '10px' }} gutter={20}>
              <Col md={12}>
                <FieldLabel>DOK</FieldLabel>
                <SelectInputStyled
                  placeholder="Select DOK"
                  onSelect={(val) => this.setState({ depthOfKnowledge: val })}
                  value={depthOfKnowledge}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  <Select.Option key="Select DOK" value="">
                    Select DOK
                  </Select.Option>
                  {selectsData.allDepthOfKnowledge.map(
                    (el) =>
                      el.value && (
                        <Select.Option key={el.value} value={el.value}>
                          {el.text}
                        </Select.Option>
                      )
                  )}
                </SelectInputStyled>
              </Col>
              <Col md={12}>
                <FieldLabel>Difficulty</FieldLabel>
                <SelectInputStyled
                  placeholder="Select Difficulty Level"
                  onSelect={(val) => this.setState({ authorDifficulty: val })}
                  value={authorDifficulty}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  <Select.Option key="Select Difficulty Level" value="">
                    Select Difficulty Level
                  </Select.Option>
                  {selectsData.allAuthorDifficulty.map(
                    (el) =>
                      el.value && (
                        <Select.Option key={el.value} value={el.value}>
                          {el.text}
                        </Select.Option>
                      )
                  )}
                </SelectInputStyled>
              </Col>
            </Row>
          </StandardSelectWrapper>
        </ModalWrapper>
      </CustomModalStyled>
    )
  }
}

const enhance = compose(
  connect(
    (state) => ({
      videoUrl: state.tests.entity.videoUrl,
      aiGenerateQuestionState: state.aiGenerateQuestionState,
    }),
    {
      setAIGeneratedQuestionState: setAIGeneratedQuestionStateAction,
      fetchAIGeneratedQuestion: fetchAIGeneratedQuestionAction,
    }
  )
)

export default enhance(AddBulkModal)
