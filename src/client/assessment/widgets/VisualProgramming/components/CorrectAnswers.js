import React from 'react'
import Question from '../../../components/Question'
import CorrectAnswers from '../../../components/CorrectAnswers'

const CorrectAnswersSection = ({
  t,
  item,
  fillSections,
  cleanSections,
  correctTab,
  setCorrectTab,
  handleAddAnswer,
  handleCloseTab,
  renderOptions,
  handlePointsChange,
}) => {
  return (
    <Question
      section="main"
      label={t('component.visualProgramming.correctAnswers')}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <CorrectAnswers
        onTabChange={setCorrectTab}
        correctTab={correctTab}
        readOnly
        onAdd={handleAddAnswer}
        validation={item.validation}
        options={renderOptions()}
        onCloseTab={handleCloseTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
        questionType={item?.title}
        isCorrectAnsTab={correctTab === 0}
        points={
          correctTab === 0
            ? item.validation.validResponse.score
            : item.validation.altResponses[correctTab - 1].score
        }
        onChangePoints={handlePointsChange}
      />
    </Question>
  )
}

export default CorrectAnswersSection
