import {
  CustomModalStyled,
  EduButton,
  EduIf,
  FieldLabel,
  NumberInputStyled,
  SelectInputStyled,
} from '@edulastic/common'
import {
  CLOZE_DROP_DOWN,
  ESSAY_PLAIN_TEXT,
  MATH,
  MULTIPLE_CHOICE,
  SHORT_TEXT,
  TRUE_OR_FALSE,
} from '@edulastic/constants/const/questionType'
import { Col, Icon, Row, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { selectsData } from '../../../TestPage/components/common'
import {
  fetchAIGeneratedQuestionAction,
  setAIGeneratedQuestionStateAction,
} from '../../../src/actions/aiGenerateQuestion'
import { ModalFooter, ModalWrapper } from '../../common/Modal'
import { QuestionFormWrapper } from '../QuestionEditModal/common/QuestionForm'
import StandardSet from '../QuestionEditModal/common/StandardSet/StandardSet'
import { StandardSelectWrapper } from './styled'

class AddBulkModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    minAvailableQuestionIndex: PropTypes.number.isRequired,
    onApply: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  state = {
    number: 2,
    type: MULTIPLE_CHOICE,
    authorDifficulty: '',
    depthOfKnowledge: '',
    generateViaAi: false,
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
      generateViaAi,
    } = this.state

    const { onApply, minAvailableQuestionIndex } = this.props

    if (!generateViaAi || aiQuestions) {
      onApply({
        number,
        type,
        startingIndex: minAvailableQuestionIndex,
        alignment,
        authorDifficulty,
        depthOfKnowledge,
        aiQuestions,
      })
    } else {
      this.generateViaAI({ questionCount: number, questionType: type })
    }
  }

  generateViaAI = ({ questionCount, questionType }) => {
    const { alignment, authorDifficulty, depthOfKnowledge } = this.state

    const { grades = [], standards = [] } = alignment?.[0] || {}
    let standardsDescription = ''
    ;(standards || []).forEach((standard) => {
      standardsDescription += standard?.description || ''
    })

    const { fetchAIGeneratedQuestion, videoUrl } = this.props
    fetchAIGeneratedQuestion({
      videoUrl,
      questionCount,
      questionType,
      questionComplexity: authorDifficulty,
      depthOfKnowledge,
      grades,
      standardsDescription,
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
      isSnapQuizVideo,
    } = this.props
    if (apiStatus) {
      setAIGeneratedQuestionState({
        apiStatus: false,
        result: [],
      })
    }
    if (isSnapQuizVideo) {
      this.setState({ generateViaAi: true })
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
      isSnapQuizVideo,
    } = this.props

    const loading = apiStatus === 'INITIATED'

    return (
      <CustomModalStyled
        visible={visible}
        title={isSnapQuizVideo ? 'Auto Genenerate' : 'Add Bulk'}
        onCancel={onCancel}
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
              {isSnapQuizVideo ? 'Generate Questions' : 'Apply'}
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
                  <Select.Option value={SHORT_TEXT}>Text</Select.Option>
                  <Select.Option value={CLOZE_DROP_DOWN}>
                    Drop down
                  </Select.Option>
                  <Select.Option value={MATH}>Math</Select.Option>
                  <Select.Option value={ESSAY_PLAIN_TEXT}>Essay</Select.Option>
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
