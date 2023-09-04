import React from 'react'
import { produce } from 'immer'
import { arrayMove } from 'react-sortable-hoc'

import Question from '../../../components/Question'
import CorrectAnswers from '../../../components/CorrectAnswers'
import QuillSortableList from '../../../components/QuillSortableList'

const CorrectAnswersSection = ({
  t,
  item,
  fillSections,
  cleanSections,
  setQuestionData,
}) => {
  const handleCorrectSortEnd = ({ oldIndex, newIndex }) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.validation.validResponse.value = arrayMove(
          draft.validation.validResponse.value,
          oldIndex,
          newIndex
        )
      })
    )
  }

  const handlePointsChange = (val) => {
    if (val < 0) {
      return
    }
    const points = parseFloat(val, 10)
    console.log(points)
    setQuestionData(
      produce(item, (draft) => {
        draft.validation.validResponse.score = points
        // updateVariables(draft)
      })
    )
  }

  const renderOptions = () => (
    <QuillSortableList
      item={item}
      prefix="options"
      readOnly
      canDelete={false}
      items={item.validation.validResponse.value.map((v) => v.output)}
      onSortEnd={handleCorrectSortEnd}
      useDragHandle
      columns={1}
    />
  )

  return (
    <Question
      section="main"
      label={t('component.visualProgramming.correctAnswers')}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <CorrectAnswers
        validation={item.validation}
        options={renderOptions()}
        fillSections={fillSections}
        cleanSections={cleanSections}
        correctTab={0}
        questionType={item?.title}
        points={item.validation.validResponse.score}
        onChangePoints={handlePointsChange}
      />
    </Question>
  )
}

export default CorrectAnswersSection
