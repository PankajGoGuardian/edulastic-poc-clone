import React, { useState } from 'react'
import produce from 'immer'
import { connect } from 'react-redux'
import { arrayMove } from 'react-sortable-hoc'

import { CLEAR, EDIT } from '../../constants/constantsForQuestions'
import { ContentArea } from '../../styled/ContentArea'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import ComposeQuestion from './components/ComposeQuestion'
import TestCases from './components/TestCases'
import CorrectAnswers from './components/CorrectAnswers'
import QuillSortableList from '../../components/QuillSortableList'
import { updateVariables } from '../../utils/variables'
import AdvancedOptions from '../SortList/components/AdvancedOptions'

const VisualProgramming = ({
  item,
  view,
  setQuestionData,
  advancedLink,
  advancedAreOpen,
  fillSections,
  cleanSections,
  t,
}) => {
	console.log(item)
  const [correctTab, setCorrectTab] = useState(0)

  const handleUiStyleChange = (prop, value) => {
    setQuestionData(
      produce(item, (draft) => {
        if (!draft.uiStyle) {
          draft.uiStyle = {}
        }
        draft.uiStyle[prop] = value
        updateVariables(draft)
      })
    )
  }

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, (draft) => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = []
        }
        draft.validation.altResponses.push({
          score: draft?.validation?.validResponse?.score,
          value: [...Array(item.source ? item.source.length : 0).keys()],
        })
      })
    )
    setCorrectTab(correctTab + 1)
  }

  const handleCloseTab = (tabIndex) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.validation.altResponses.splice(tabIndex, 1)

        setCorrectTab(0)
        updateVariables(draft)
      })
    )
  }

  const handleCorrectSortEnd = ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, (draft) => {
        if (correctTab === 0) {
          draft.validation.validResponse.value = arrayMove(
            draft.validation.validResponse.value,
            oldIndex,
            newIndex
          )
        } else {
          draft.validation.altResponses[correctTab - 1].value = arrayMove(
            draft.validation.altResponses[correctTab - 1].value,
            oldIndex,
            newIndex
          )
        }
      })
    )
  }

  const handlePointsChange = (val) => {
    if (val < 0) {
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

  const renderOptions = () => (
    <QuillSortableList
      item={item}
      prefix="options"
      readOnly
      canDelete={false}
      items={
        correctTab === 0
          ? item.validation.validResponse.value.map((ind) => item.source[ind])
          : item.validation.altResponses[correctTab - 1].value.map(
              (ind) => item.source[ind]
            )
      }
      onSortEnd={handleCorrectSortEnd}
      useDragHandle
      columns={1}
    />
  )

  return (
    <>
      {
        view === EDIT ? (
          <ContentArea>
            <ComposeQuestion
              fillSections={fillSections}
              cleanSections={cleanSections}
              t={t}
              stimulus={item.stimulus}
              setQuestionData={setQuestionData}
              produce={produce}
              item={item}
            />
            <TestCases
              setQuestionData={setQuestionData}
              t={t}
              fillSections={fillSections}
              cleanSections={cleanSections}
              produce={produce}
              item={item}
            />
            {/* <CorrectAnswers
              setQuestionData={setQuestionData}
              t={t}
              fillSections={fillSections}
              cleanSections={cleanSections}
              item={item}
              onTabChange={setCorrectTab}
              correctTab={correctTab}
              readOnly
              onAdd={handleAddAnswer}
              validation={item.validation}
              options={renderOptions()}
              onCloseTab={handleCloseTab}
              questionType={item?.title}
              isCorrectAnsTab={correctTab === 0}
              points={
                correctTab === 0
                  ? item.validation.validResponse.score
                  : item.validation.altResponses[correctTab - 1].score
              }
              onChangePoints={handlePointsChange}
            /> */}
            {advancedLink}
            {/* <AdvancedOptions
              item={item}
              onUiChange={handleUiStyleChange}
              advancedAreOpen={advancedAreOpen}
              fillSections={fillSections}
              cleanSections={cleanSections}
            /> */}
          </ContentArea>
        ) : null
        //   (
        //     <Display
        //       saveAnswer={saveAnswer}
        //       item={item}
        //       t={t}
        //       stimulus={item.stimulus}
        //       evaluation={evaluation}
        //       previewTab={previewTab}
        //       showQuestionNumber={showQuestionNumber}
        //       userAnswer={userAnswer}
        //       disableResponse={disableResponse}
        //       changePreviewTab={changePreviewTab}
        //       isReviewTab={isReviewTab}
        //       view={view}
        //       hideCorrectAnswer={hideCorrectAnswer}
        //       showAnswerScore={showAnswerScore}
        //     />
        //   )
      }
    </>
  )
}

VisualProgramming.defaultProps = {
  previewTab: CLEAR,
  item: {},
  userAnswer: [],
  evaluation: [],
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {},
  showQuestionNumber: false,
}

export default connect(null, {
  setQuestionData: setQuestionDataAction,
})(VisualProgramming)
