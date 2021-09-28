import React, { Component } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import styled from 'styled-components'
import uuid from 'uuid/v4'
import { max } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { FlexContainer, EduButton } from '@edulastic/common'
import { questionTitle } from '@edulastic/constants'
import Question from '../../components/Question'
import CorrectAnswers from '../../components/CorrectAnswers'
import CorrectAnswer from './CorrectAnswer'
import { updateVariables } from '../../utils/variables'
import MaxResponses from './components/MaxResponses'

class SetCorrectAnswers extends Component {
  constructor() {
    super()
    this.state = {
      currentTab: 0,
    }
  }

  handleAddAltResponses = () => {
    const { setQuestionData, question } = this.props
    const { currentTab } = this.state

    setQuestionData(
      produce(question, (draft) => {
        const response = {
          score: draft?.validation?.validResponse?.score,
          value: [],
        }

        if (
          draft.validation.altResponses &&
          draft.validation.altResponses.length
        ) {
          draft.validation.altResponses.push(response)
        } else {
          draft.validation.altResponses = [response]
        }
      })
    )

    this.setState({
      currentTab: currentTab + 1,
    })
  }

  handleRemoveAltResponses = (index) => {
    const { setQuestionData, question } = this.props
    setQuestionData(
      produce(question, (draft) => {
        if (
          draft.validation.altResponses &&
          draft.validation.altResponses.length
        ) {
          draft.validation.altResponses = draft.validation.altResponses.filter(
            (response, i) => i !== index
          )
        }
      })
    )
    this.setState({
      currentTab: 0,
    })
  }

  updateAnswers = (answers) => {
    const { question, setQuestionData } = this.props
    const { currentTab } = this.state
    setQuestionData(
      produce(question, (draft) => {
        if (currentTab === 0) {
          draft.validation.validResponse.value = answers
        } else if (currentTab > 0) {
          draft.validation.altResponses[currentTab - 1].value = answers
        }
      })
    )
  }

  updateScore = (score) => {
    if (score < 0) {
      return
    }
    const points = parseFloat(score, 10)
    const { question, setQuestionData } = this.props
    const { currentTab } = this.state

    setQuestionData(
      produce(question, (draft) => {
        if (currentTab === 0) {
          draft.validation.validResponse.score = points
        } else if (currentTab > 0) {
          draft.validation.altResponses[currentTab - 1].score = points
        }
      })
    )
  }

  editOptions = (index, value) => {
    const { question, setQuestionData } = this.props
    setQuestionData(
      produce(question, (draft) => {
        draft.options[index] = {
          value: question.options[index].value,
          label: value,
        }
        updateVariables(draft)
      })
    )
  }

  removeOption = (index) => {
    const { question, setQuestionData } = this.props
    setQuestionData(
      produce(question, (draft) => {
        const [removedOption] = draft.options.splice(index, 1)
        draft.validation.validResponse.value = draft.validation.validResponse.value.filter(
          (validOption) => validOption !== removedOption.value
        )

        for (let i = index + 1; i < draft.options.length; i++) {
          if (draft.variable && draft.variable.variableStatus) {
            draft.variable.variableStatus[`option-${i - 1}`] =
              draft.variable.variableStatus[`option-${i}`]
          }
        }
        updateVariables(draft)
      })
    )
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { question, setQuestionData } = this.props
    setQuestionData(
      produce(question, (draft) => {
        ;[draft.options[oldIndex], draft.options[newIndex]] = [
          draft.options[newIndex],
          draft.options[oldIndex],
        ]
        updateVariables(draft)
      })
    )
  }

  handleTabChange = (value) => {
    this.setState({ currentTab: value })
  }

  addNewChoiceBtn = () => {
    const { question, setQuestionData } = this.props
    setQuestionData(
      produce(question, (draft) => {
        draft.options.push({
          value: uuid(),
          label: '',
        })
      })
    )
  }

  get response() {
    const { validation } = this.props
    const { currentTab } = this.state
    if (currentTab === 0) {
      return validation.validResponse
    }
    return validation.altResponses[currentTab - 1]
  }

  get maxResponsesMin() {
    const { validation, multipleResponses } = this.props
    if (!multipleResponses) {
      return null
    }
    const { validResponse, altResponses } = validation
    const answers = [validResponse]
      .concat(altResponses)
      .map((answer) => answer?.value?.length)
    return max(answers)
  }

  render() {
    const {
      t,
      stimulus,
      options,
      onChangeOption,
      multipleResponses,
      uiStyle,
      styleType,
      fontSize,
      question = {},
      cleanSections,
      fillSections,
    } = this.props
    const { currentTab } = this.state
    const title = currentTab === 0 ? 'correct' : 'alternative'
    const isTrueFalse = question.title === questionTitle.MCQ_TRUE_OR_FALSE

    return (
      <Question
        section="main"
        label={t('component.correctanswers.setcorrectanswers')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <CorrectAnswers
          correctTab={currentTab}
          fillSections={fillSections}
          cleanSections={cleanSections}
          validation={question.validation}
          questionType={question?.title}
          onAdd={this.handleAddAltResponses}
          onCloseTab={this.handleRemoveAltResponses}
          onTabChange={this.handleTabChange}
          onChangePoints={this.updateScore}
          points={this.response.score}
          isCorrectAnsTab={currentTab === 0}
        >
          <CorrectAnswer
            uiStyle={uiStyle}
            stimulus={stimulus}
            multipleResponses={multipleResponses}
            options={options}
            styleType={styleType}
            fontSize={fontSize}
            title={title}
            response={this.response}
            onSortOptions={this.onSortEnd}
            onChangeOption={this.editOptions}
            onRemoveOption={this.removeOption}
            onUpdateValidationValue={this.updateAnswers}
          />
        </CorrectAnswers>
        <Divider />
        <FlexContainer justifyContent="flex-start" alignItems="center">
          {(!isTrueFalse || question?.options?.length < 2) && (
            <EduButton
              ml="0px"
              mr="8px"
              height="28px"
              data-cy="add-new-ch"
              onClick={this.addNewChoiceBtn}
            >
              {t('component.multiplechoice.addnewchoice')}
            </EduButton>
          )}
          {!isTrueFalse && (
            <MaxResponses
              max={options?.length}
              min={this.maxResponsesMin}
              value={question.maxResponses}
              multipleResponses={multipleResponses}
              onChangeOption={onChangeOption}
            />
          )}
        </FlexContainer>
      </Question>
    )
  }
}

CorrectAnswers.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  question: PropTypes.object.isRequired,
  multipleResponses: PropTypes.bool.isRequired,
  uiStyle: PropTypes.object.isRequired,
  styleType: PropTypes.string,
  fontSize: PropTypes.any.isRequired,
}

CorrectAnswers.defaultProps = {
  stimulus: '',
  options: [],
  validation: {},
  styleType: 'default',
}

export default withNamespaces('assessment')(SetCorrectAnswers)

const Divider = styled.div`
  padding: 10px 0;
`
