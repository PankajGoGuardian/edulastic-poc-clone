import React, { useState } from 'react'
import produce from 'immer'
import { connect } from 'react-redux'

import { EDIT, CLEAR, CHECK, SHOW } from '../../constants/constantsForQuestions'
import { ContentArea } from '../../styled/ContentArea'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import ComposeQuestion from './components/ComposeQuestion'
import TestCases from './components/TestCases'
// import CorrectAnswers from './components/CorrectAnswers'
import QuillSortableList from '../../components/QuillSortableList'
import { replaceVariables, updateVariables } from '../../utils/variables'
import Display from './components/Display'
import InitialCode from './components/InitialCode'
import { getFontSize } from '../../utils/helpers'
import { cloneDeep } from 'lodash'
import { changePreviewAction } from '../../../author/src/actions/view'

const VisualProgramming = ({
  item,
  view,
  setQuestionData,
  //   advancedLink,
  fillSections,
  cleanSections,
  t,
  col,
  qIndex,
  previewTab,
  history,
  smallSize,
  userAnswer,
  testItem,
  evaluation,
  flowLayout,
  disableResponse,
  changePreviewTab,
  changeView,
  saveAnswer,
  ...restProps
}) => {
  const qid = item.id

  const handleAddAnswer = (e) => {
    // setQuestionData(
    //   produce(item, (draft) => {
    //     if (!draft.validation.altResponses) {
    //       draft.validation.altResponses = []
    //     }
    //     draft.validation.altResponses.push({
    //       score: draft?.validation?.validResponse?.score,
    //       value: [...Array(item.source ? item.source.length : 0).keys()],
    //     })
    //   })
    // )
    // setCorrectTab(correctTab + 1)
    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR)
      changeView(CLEAR)
    }
    saveAnswer(e)
  }

  const getRenderData = () => {
    // const { item: templateItem, history, view } = props
    // const templateItem = item
    const workingItem = view === EDIT ? item : replaceVariables(item)
    const locationState = history.location.state
    const isDetailPage =
      locationState !== undefined ? locationState.itemDetail : false
    let previewDisplayOptions
    let previewStimulus
    let itemForEdit
    if (workingItem.smallSize || isDetailPage) {
      previewStimulus = workingItem.stimulus
      previewDisplayOptions = workingItem.options
      itemForEdit = item
    } else {
      previewStimulus = workingItem.stimulus
      previewDisplayOptions = workingItem.options
      itemForEdit = {
        ...item,
        stimulus: item.stimulus,
        list: item.options,
        validation: item.validation,
      }
    }

    return {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle: workingItem.uiStyle,
      maxResponses: workingItem.maxResponses,
      multipleResponses: !!workingItem.multipleResponses,
    }
  }
  const {
    previewStimulus,
    previewDisplayOptions,
    itemForEdit,
    uiStyle,
    multipleResponses,
  } = getRenderData()
  const fontSize = getFontSize(uiStyle?.fontsize)

  return (
    <>
      {view === EDIT ? (
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
          <InitialCode
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
          {/* {advancedLink} */}
          {/* <AdvancedOptions
              item={item}
              onUiChange={handleUiStyleChange}
              advancedAreOpen={advancedAreOpen}
              fillSections={fillSections}
              cleanSections={cleanSections}
            /> */}
        </ContentArea>
      ) : (
        <Display
          // saveAnswer={saveAnswer}
          showAnswer={previewTab === SHOW}
          preview={previewTab === CLEAR}
          item={item}
          checkAnswer={previewTab === CHECK}
          t={t}
          stimulus={item.stimulus}
          // evaluation={evaluation}
          // previewTab={previewTab}
          // showQuestionNumber={showQuestionNumber}
          // userAnswer={userAnswer}
          // disableResponse={disableResponse}
          // changePreviewTab={changePreviewTab}
          // isReviewTab={isReviewTab}
          // view={view}
          // hideCorrectAnswer={hideCorrectAnswer}
          // showAnswerScore={showAnswerScore}
          view={view}
          smallSize={smallSize}
          // options={previewDisplayOptions}
          question={previewStimulus}
          userSelections={userAnswer}
          uiStyle={uiStyle}
          evaluation={evaluation}
          validation={item.validation}
          onChange={!disableResponse ? handleAddAnswer : () => {}}
          // onRemove={handleRemoveAnswer}
          qIndex={qIndex}
          qId={item.id}
          multipleResponses={multipleResponses}
          flowLayout={flowLayout}
          qLabel={item.qLabel}
          qSubLabel={item.qSubLabel}
          testItem={testItem}
          styleType="primary"
          fontSize={fontSize}
          {...restProps}
        />
      )}
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
  changeView: changePreviewAction,
})(VisualProgramming)
