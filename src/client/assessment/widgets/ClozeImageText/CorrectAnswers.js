import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { keys, cloneDeep, isPlainObject } from 'lodash'
import produce from 'immer'
import CorrectAnswers from '../../components/CorrectAnswers'
import CorrectAnswer from './CorrectAnswer'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'

class SetCorrectAnswers extends Component {
  constructor() {
    super()
    this.state = {
      currentTab: 0,
    }
  }

  handleTabChange = (currentTab) => {
    this.setState({ currentTab })
  }

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props
    const { currentTab } = this.state

    setQuestionData(
      produce(item, (draft) => {
        const response = {
          score: draft?.validation?.validResponse?.score,
          value: {},
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
    const { setQuestionData, item } = this.props
    setQuestionData(
      produce(item, (draft) => {
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

  updateResponseBoxWidth = (newData) => {
    let maxLength = 0
    const { value: correctAnswers } = newData.validation.validResponse
    keys(correctAnswers).forEach((id) => {
      maxLength = Math.max(
        maxLength,
        correctAnswers[id] ? correctAnswers[id].length : 0
      )
    })

    newData.validation.altResponses.forEach((arr) => {
      const { value: altCorrectAnswers } = arr
      keys(altCorrectAnswers).forEach((id) => {
        maxLength = Math.max(
          maxLength,
          altCorrectAnswers[id] ? altCorrectAnswers[id].length : 0
        )
      })
    })
    const finalWidth = 40 + maxLength * 7
    newData.uiStyle = isPlainObject(newData.uiStyle) ? newData.uiStyle : {}
    newData.uiStyle.width =
      finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth

    return newData
  }

  updateAnswers = (answers) => {
    const { item, setQuestionData, updateVariables } = this.props
    const { currentTab } = this.state
    const newAnswers = cloneDeep(answers)

    setQuestionData(
      produce(item, (draft) => {
        if (currentTab === 0) {
          draft.validation.validResponse.value = newAnswers
        } else if (currentTab > 0) {
          draft.validation.altResponses[currentTab - 1].value = newAnswers
        }
        draft = this.updateResponseBoxWidth(draft)
        updateVariables(draft)
      })
    )
  }

  updateScore = (score) => {
    if (score < 0) {
      return
    }
    const points = parseFloat(score, 10)
    const { item, setQuestionData } = this.props
    const { currentTab } = this.state

    setQuestionData(
      produce(item, (draft) => {
        if (currentTab === 0) {
          draft.validation.validResponse.score = points
        } else if (currentTab > 0) {
          draft.validation.altResponses[currentTab - 1].score = points
        }
      })
    )
  }

  get response() {
    const { validation } = this.props
    const { currentTab } = this.state
    if (currentTab === 0) {
      return validation.validResponse
    }
    return validation.altResponses[currentTab - 1] || {}
  }

  render() {
    const {
      stimulus,
      imageAlterText,
      imageWidth,
      options,
      imageUrl,
      backgroundColor,
      responses,
      configureOptions,
      uiStyle,
      maxRespCount,
      showDashedBorder,
      imageOptions,
      item,
      fillSections,
      cleanSections,
    } = this.props
    const { currentTab } = this.state

    return (
      <CorrectAnswers
        correctTab={currentTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
        validation={item.validation}
        questionType={item?.title}
        onAdd={this.handleAddAltResponses}
        onCloseTab={this.handleRemoveAltResponses}
        onTabChange={this.handleTabChange}
        onChangePoints={this.updateScore}
        points={this.response.score}
        isCorrectAnsTab={currentTab === 0}
      >
        <CorrectAnswer
          response={this.response}
          stimulus={stimulus}
          options={options}
          uiStyle={uiStyle}
          responses={responses}
          imageUrl={imageUrl}
          showDashedBorder={showDashedBorder}
          configureOptions={configureOptions}
          imageAlterText={imageAlterText}
          imageWidth={imageWidth}
          maxRespCount={maxRespCount}
          onUpdateValidationValue={this.updateAnswers}
          backgroundColor={backgroundColor}
          imageOptions={imageOptions}
        />
      </CorrectAnswers>
    )
  }
}

SetCorrectAnswers.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  responses: PropTypes.array,
  showDashedBorder: PropTypes.bool,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  backgroundColor: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  imageWidth: PropTypes.number,
  maxRespCount: PropTypes.number,
  imageOptions: PropTypes.object,
  item: PropTypes.object.isRequired,
}

SetCorrectAnswers.defaultProps = {
  stimulus: '',
  options: [],
  responses: [],
  validation: {},
  showDashedBorder: false,
  backgroundColor: '#fff',
  imageUrl: '',
  imageAlterText: '',
  imageWidth: 600,
  maxRespCount: 1,
  uiStyle: {
    responsecontainerposition: 'bottom',
    fontsize: 'normal',
    stemNumeration: '',
    width: 0,
    height: 0,
    wordwrap: false,
  },
  imageOptions: {},
}

const enhance = compose(
  connect(null, { setQuestionData: setQuestionDataAction })
)

export default enhance(SetCorrectAnswers)
