import React, { Component } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import { withNamespaces } from '@edulastic/localization'
import { CheckboxLabel } from '../../styled/CheckboxWithLabel'
import CorrectAnswers from '../../components/CorrectAnswers'
import Question from '../../components/Question'
import Matrix from './components/Matrix'

class Answers extends Component {
  constructor() {
    super()
    this.state = {
      correctTab: 0,
    }
  }

  setCorrectTab = (tabNumber) => {
    this.setState({ correctTab: tabNumber < 0 ? 0 : tabNumber })
  }

  handleCheck = ({ rowIndex, columnIndex, checked }) => {
    const { item, setQuestionData } = this.props
    const { correctTab } = this.state
    const isAlt = correctTab > 0
    setQuestionData(
      produce(item, (draft) => {
        let value
        const rowIds = draft?.responseIds[rowIndex]

        if (!isAlt) {
          value = draft.validation.validResponse.value || {}
        }

        if (isAlt) {
          value = draft.validation.altResponses[correctTab - 1].value || {}
        }
        const selectedId = rowIds[columnIndex]
        value[selectedId] = checked
        if (!draft.multipleResponses) {
          rowIds.forEach((id) => {
            if (id !== selectedId) {
              delete value[id]
            }
          })
        }
        if (!value[selectedId]) {
          delete value[selectedId]
        }
        if (!isAlt) {
          draft.validation.validResponse.value = value
        }
        if (isAlt) {
          draft.validation.altResponses[correctTab - 1].value = value
        }
      })
    )
  }

  handleChangePoints = (score) => {
    if (score < 0) {
      return
    }
    const points = parseFloat(score, 10)
    const { item, setQuestionData } = this.props
    const { correctTab } = this.state
    const isAlt = correctTab > 0

    setQuestionData(
      produce(item, (draft) => {
        if (!isAlt) {
          draft.validation.validResponse.score = points
        } else {
          draft.validation.altResponses[correctTab - 1].score = points
        }
      })
    )
  }

  get response() {
    const { item } = this.props
    const { correctTab } = this.state
    if (correctTab === 0) {
      return item.validation.validResponse
    }
    return item.validation.altResponses[correctTab - 1]
  }

  get points() {
    const { item } = this.props
    const { correctTab } = this.state
    if (correctTab === 0) {
      return item.validation.validResponse.score
    }
    return item.validation.altResponses[correctTab - 1].score
  }

  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props
    const { correctTab } = this.state

    const handleAddAnswer = () => {
      setQuestionData(
        produce(item, (draft) => {
          if (!draft.validation.altResponses) {
            draft.validation.altResponses = []
          }
          draft.validation.altResponses.push({
            score: item?.validation?.validResponse?.score,
            value: item?.validation?.validResponse?.value,
          })
        })
      )
      this.setCorrectTab(correctTab + 1)
    }

    const handleChangeMultiple = (e) => {
      const { checked } = e.target
      setQuestionData(
        produce(item, (draft) => {
          draft.multipleResponses = checked

          if (!checked) {
            draft.validation.validResponse.value = {}

            if (
              draft.validation.altResponses &&
              draft.validation.altResponses.length
            ) {
              draft.validation.altResponses.map((res) => {
                res.value = {}
                return res
              })
            }
          }
        })
      )
    }

    const handleCloseTab = (tabIndex) => {
      setQuestionData(
        produce(item, (draft) => {
          draft.validation.altResponses.splice(tabIndex, 1)
        })
      )

      this.setCorrectTab(correctTab - 1)
    }

    const renderOptions = () => (
      <div>
        <CheckboxLabel
          data-cy="multi"
          onChange={handleChangeMultiple}
          checked={item.multipleResponses}
        >
          {t('component.matrix.multipleResponses')}
        </CheckboxLabel>
      </div>
    )

    const correctAnswerProps = {
      item,
      stems: item.stems,
      options: item.options,
      uiStyle: item.uiStyle,
      responseIds: item.responseIds,
      isMultiple: item.multipleResponses,
      response: this.response,
      onCheck: this.handleCheck,
    }

    return (
      <Question
        section="main"
        label={t('component.correctanswers.setcorrectanswers')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <CorrectAnswers
          correctTab={correctTab}
          fillSections={fillSections}
          cleanSections={cleanSections}
          validation={item.validation}
          questionType={item?.title}
          options={renderOptions()}
          onAdd={handleAddAnswer}
          onCloseTab={handleCloseTab}
          onTabChange={this.setCorrectTab}
          onChangePoints={this.handleChangePoints}
          points={this.points}
          isCorrectAnsTab={correctTab === 0}
        >
          <Matrix {...correctAnswerProps} />
        </CorrectAnswers>
      </Question>
    )
  }
}

Answers.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

Answers.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
}

export default withNamespaces('assessment')(Answers)
