import React from 'react'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagic } from '@fortawesome/free-solid-svg-icons'
import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  TRUE_OR_FALSE,
  ESSAY_PLAIN_TEXT,
  AUDIO_RESPONSE,
} from '@edulastic/constants/const/questionType'
import {
  IconNewList,
  IconMath,
  IconTrueFalse,
  IconPencilHollow,
  IconTextEntry,
  IconDropDown,
  IconWhiteMic,
  IconStar,
} from '@edulastic/icons'
import { EduIf } from '@edulastic/common'
import i18 from '@edulastic/localization'
import { withRouter } from 'react-router'
import { Tooltip } from '../../../../common/utils/helpers'

import AddBulkModal from './AddBulkModal'
import {
  AddQuestionWrapper,
  AddQuestionIcon,
  QuestionTypes,
  ContentWrapper,
  CustomStyleBtn2,
  AddOnContainer,
} from '../styled-components/AddQuestion'
import { formatStandard } from '../utils/questionsHelpers'
import { alignmentStandardsFromUIToMongo } from '../../../../assessment/utils/helpers'
import { questionGenerationStatus } from '../constants'
import { navigationState } from '../../../src/constants/navigation'

class AddQuestion extends React.Component {
  state = {
    bulkModalVisible: false,
    aiQuestionsGenerationStatus: questionGenerationStatus.INITIAL,
  }

  toggleBulkModal = () => {
    const { isVideoQuizAndAIEnabled, history } = this.props

    if (isVideoQuizAndAIEnabled) {
      this.setState(({ bulkModalVisible }) => ({
        bulkModalVisible: !bulkModalVisible,
      }))
    } else {
      history.push({
        pathname: '/author/subscription',
        state: { view: navigationState.SUBSCRIPTION.view.ADDON },
      })
    }
  }

  setAiQuestionsGenerationStatus = (status) => {
    this.setState({
      aiQuestionsGenerationStatus: status,
    })
  }

  handleApply = ({
    number,
    type,
    startingIndex,
    alignment,
    authorDifficulty,
    depthOfKnowledge,
    aiQuestions,
    isFromAddBulk = false,
  }) => {
    const { onAddQuestion, scrollToBottom } = this.props
    const { bulkModalVisible } = this.state

    for (let i = 0; i < number && i < aiQuestions?.length; i++) {
      if (isFromAddBulk && !isEmpty(aiQuestions?.[i])) {
        const { standards: standardsData = [] } = alignment?.[0] || {}
        const {
          commonCoreStandard = '',
          depthOfKnowledge: questionDok = '',
          difficultLevel = '',
        } = aiQuestions[i] || {}

        const standardData = standardsData.find(
          (standard) => standard?.identifier === commonCoreStandard
        )

        if (!isEmpty(standardData)) {
          const standard = formatStandard(standardData)
          const domains = alignmentStandardsFromUIToMongo([standardData])
          alignment = [
            {
              ...alignment[0],
              standards: [standard],
              domains,
            },
          ]
        }
        if (questionDok?.length) {
          depthOfKnowledge = questionDok
        }
        if (difficultLevel?.length) {
          authorDifficulty = difficultLevel
        }
      }

      const index = startingIndex + i
      onAddQuestion(
        type,
        index,
        startingIndex,
        {
          alignment,
          authorDifficulty,
          depthOfKnowledge,
        },
        aiQuestions?.[i],
        isFromAddBulk
      )()
    }

    if (bulkModalVisible) {
      this.toggleBulkModal()
    }
    scrollToBottom()
  }

  render() {
    const { bulkModalVisible, aiQuestionsGenerationStatus } = this.state
    const {
      onAddQuestion,
      minAvailableQuestionIndex,
      enableAudioResponseQuestion,
      disableAutoGenerate,
      questions,
      isVideoQuizAndAIEnabled,
    } = this.props

    const tooltipMessage = disableAutoGenerate
      ? `${i18.t('author:videoQuiz.autoGenerateNotSupported')}`
      : isVideoQuizAndAIEnabled
      ? `${i18.t('author:rubric.infoText')}`
      : `${i18.t('author:aiSuite.addOnText')}`

    return (
      <AddQuestionWrapper>
        <ContentWrapper>
          <QuestionTypes flexDirection="column">
            <Tooltip placement="top" title="Multiple Choice">
              <AddQuestionIcon
                onClick={onAddQuestion(MULTIPLE_CHOICE)}
                data-cy={MULTIPLE_CHOICE}
              >
                <IconNewList />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="Text Entry">
              <AddQuestionIcon
                onClick={onAddQuestion(SHORT_TEXT)}
                data-cy={SHORT_TEXT}
              >
                <IconTextEntry />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="Drop down">
              <AddQuestionIcon
                onClick={onAddQuestion(CLOZE_DROP_DOWN)}
                data-cy={CLOZE_DROP_DOWN}
              >
                <IconDropDown />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="Math">
              <AddQuestionIcon onClick={onAddQuestion(MATH)} data-cy={MATH}>
                <IconMath />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="True/False">
              <AddQuestionIcon
                onClick={onAddQuestion(TRUE_OR_FALSE)}
                data-cy={TRUE_OR_FALSE}
              >
                <IconTrueFalse />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="Essay">
              <AddQuestionIcon
                onClick={onAddQuestion(ESSAY_PLAIN_TEXT)}
                data-cy={ESSAY_PLAIN_TEXT}
              >
                <IconPencilHollow />
              </AddQuestionIcon>
            </Tooltip>
            <EduIf condition={enableAudioResponseQuestion}>
              <Tooltip placement="top" title="Audio">
                <AddQuestionIcon
                  onClick={onAddQuestion(AUDIO_RESPONSE)}
                  data-cy={AUDIO_RESPONSE}
                >
                  <IconWhiteMic />
                </AddQuestionIcon>
              </Tooltip>
            </EduIf>
          </QuestionTypes>
          <Tooltip title={tooltipMessage}>
            <QuestionTypes>
              <CustomStyleBtn2
                margin="0px"
                height="32px"
                width="100%"
                onClick={this.toggleBulkModal}
                data-cy="addBulk"
                disabled={disableAutoGenerate}
              >
                <FontAwesomeIcon icon={faMagic} aria-hidden="true" />
                Auto Generate
                <EduIf condition={!isVideoQuizAndAIEnabled}>
                  <AddOnContainer>
                    <IconStar />
                  </AddOnContainer>
                </EduIf>
              </CustomStyleBtn2>
            </QuestionTypes>
          </Tooltip>
          <AddBulkModal
            visible={bulkModalVisible}
            questions={questions}
            onCancel={this.toggleBulkModal}
            onApply={this.handleApply}
            minAvailableQuestionIndex={minAvailableQuestionIndex}
            aiQuestionsGenerationStatus={aiQuestionsGenerationStatus}
            setAiQuestionsGenerationStatus={this.setAiQuestionsGenerationStatus}
          />
        </ContentWrapper>
      </AddQuestionWrapper>
    )
  }
}

AddQuestion.propTypes = {
  minAvailableQuestionIndex: PropTypes.number.isRequired,
  onAddQuestion: PropTypes.func.isRequired,
  disableAutoGenerate: PropTypes.bool.isRequired,
  questions: PropTypes.array.isRequired,
}

export default withRouter(AddQuestion)
