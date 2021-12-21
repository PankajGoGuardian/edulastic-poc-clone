import React, { useState } from 'react'
import { withNamespaces } from '@edulastic/localization'
import { withTheme } from 'styled-components'
import { connect } from 'react-redux'
import produce from 'immer'
import { compose } from 'redux'
import PossibleResponses from './components/PossibleResponses'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import Question from '../../components/Question'
import { updateVariables } from '../../utils/variables'
import CorrectAnswers from '../../components/CorrectAnswers'
import PreviewPictograph from './PreviewPictograph'
import QuestionLayer from './components/QuestionLayer'
import Options from './components/Options'
import ComposeQuestion from '../OrderList/ComposeQuestion'
import Classifications from './components/Classifications'
import { EDIT } from '../../constants/constantsForQuestions'

const EditPictograph = ({
  t,
  item,
  setQuestionData,
  fillSections,
  cleanSections,
  advancedLink,
  advancedAreOpen,
}) => {
  const [correctTab, setCorrectTab] = useState(0)

  const { classifications, uiStyle, showClassName } = item

  const getInitalAnswerMap = () => {
    const initalAnswerMap = {}
    classifications.forEach((classification) => {
      initalAnswerMap[classification.id] =
        initalAnswerMap[classification.id] || []
    })
    return initalAnswerMap
  }

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, (draft) => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = []
        }
        draft.validation.altResponses.push({
          score: draft?.validation?.validResponse?.score,
          value: getInitalAnswerMap(),
        })

        updateVariables(draft)
      })
    )
    setCorrectTab(correctTab + 1)
  }

  const handleCloseTab = (tabIndex) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.validation.altResponses.splice(tabIndex, 1)
        updateVariables(draft)
      })
    )
    setCorrectTab(0)
  }

  const handlePointsChange = (val) => {
    if (!(val > 0)) {
      return
    }
    const points = parseFloat(val, 10)
    setQuestionData(
      produce(item, (draft) => {
        if (correctTab === 0) {
          draft.validation.validResponse.score = points
        } else {
          draft.validation.altResponses[correctTab - 1].score = points
        }
        updateVariables(draft)
      })
    )
  }

  const handleDroppedChoices = (droppedChoice) => {
    setQuestionData(
      produce(item, (draft) => {
        if (draft.droppedChoices) {
          draft.droppedChoices = droppedChoice
        }
        updateVariables(draft)
      })
    )
  }

  const handleAnswerChange = (answer) => {
    setQuestionData(
      produce(item, (draft) => {
        if (correctTab === 0) {
          if (draft.validation && draft.validation.validResponse) {
            draft.validation.validResponse.value = answer
          }
        } else if (
          draft.validation &&
          draft.validation.altResponses &&
          draft.validation.altResponses[correctTab - 1]
        )
          draft.validation.altResponses[correctTab - 1].value = answer

        updateVariables(draft)
      })
    )
  }

  const handleItemChangeChange = (key, val) => {
    setQuestionData(
      produce(item, (draft) => {
        draft[key] = val
        if (key === 'duplicateResponses') {
          draft.validation.validResponse.value = getInitalAnswerMap()
          draft.validation.altResponses.forEach((altResponse) => {
            altResponse.value = getInitalAnswerMap()
          })
        }
        updateVariables(draft)
      })
    )
  }

  const correctAnswers =
    correctTab === 0
      ? item.validation.validResponse.value
      : item.validation.altResponses[correctTab - 1].value

  const { droppedChoices } = item

  const renderOptions = () => (
    <PreviewPictograph
      item={item}
      saveAnswer={handleAnswerChange}
      editCorrectAnswers={correctAnswers}
      droppedChoices={droppedChoices}
      setQuestionData={setQuestionData}
      showClassName={showClassName}
      view={EDIT}
    />
  )

  const renderOptionsQuestionLayer = () => (
    <PreviewPictograph
      item={item}
      saveAnswer={handleDroppedChoices}
      editCorrectAnswers={droppedChoices}
      setQuestionData={setQuestionData}
      showClassName={showClassName}
      view={EDIT}
      isQuestionLayer
    />
  )

  return (
    <>
      <ComposeQuestion
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />
      <Question
        section="main"
        label={t('component.pictograph.classifications')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Classifications
          item={item}
          setQuestionData={setQuestionData}
          handleItemChangeChange={handleItemChangeChange}
        />
      </Question>
      <Question
        section="main"
        label={t('component.pictograph.enterElements')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <PossibleResponses
          item={item}
          setQuestionData={setQuestionData}
          getInitalAnswerMap={getInitalAnswerMap}
          uiStyle={uiStyle}
          handleItemChangeChange={handleItemChangeChange}
        />
      </Question>
      <Question
        section="main"
        label={t('component.pictograph.questionLayer')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <QuestionLayer
          fillSections={fillSections}
          cleanSections={cleanSections}
          options={renderOptionsQuestionLayer()}
        />
      </Question>
      <Question
        section="main"
        label={t('component.pictograph.correctAnswer')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <CorrectAnswers
          onTabChange={setCorrectTab}
          correctTab={correctTab}
          onAdd={handleAddAnswer}
          validation={item.validation}
          options={renderOptions()}
          onCloseTab={handleCloseTab}
          fillSections={fillSections}
          cleanSections={cleanSections}
          marginBottom="-50px"
          questionType={item?.title}
          points={
            correctTab === 0
              ? item.validation.validResponse.score
              : item.validation.altResponses[correctTab - 1].score
          }
          onChangePoints={handlePointsChange}
          isCorrectAnsTab={correctTab === 0}
          noAlternateAnswer
        />
      </Question>
      {advancedLink}

      <Options
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
        item={item}
      />
    </>
  )
}

const enhance = compose(
  withNamespaces('assessment'),
  withTheme,
  connect(null, {
    setQuestionData: setQuestionDataAction,
  })
)

export default enhance(EditPictograph)
