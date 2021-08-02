import React, { Component } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import { withNamespaces } from '@edulastic/localization'
import CorrectAnswers from '../../components/CorrectAnswers'
import CorrectAnswer from './CorrectAnswer'
import { updateVariables } from '../../utils/variables'

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
    if (!(score > 0)) {
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

  get response() {
    const { validation } = this.props
    const { currentTab } = this.state
    if (currentTab === 0) {
      return validation.validResponse
    }
    return validation.altResponses[currentTab - 1]
  }

  render() {
    const {
      stimulus,
      options,
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
    const { response } = this

    return (
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
        points={response.score}
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
          response={response}
          onSortOptions={this.onSortEnd}
          onChangeOption={this.editOptions}
          onRemoveOption={this.removeOption}
          onUpdateValidationValue={this.updateAnswers}
        />
      </CorrectAnswers>
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
