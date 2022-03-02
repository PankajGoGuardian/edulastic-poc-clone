import React, { useState } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'

import { withNamespaces } from '@edulastic/localization'

import { EXACT_MATCH, CONTAINS } from '../../constants/constantsForQuestions'
import { updateVariables } from '../../utils/variables'

import CorrectAnswers from '../../components/CorrectAnswers'
import { ContentArea } from '../../styled/ContentArea'

import ComposeAnswer from './components/ComposeAnswer'
import ComposeQuestion from './components/ComposeQuestion'
import Options from './components/Options'
import Question from '../../components/Question'

const EditShortText = ({
  item,
  setQuestionData,
  fillSections,
  cleanSections,
  advancedLink,
  advancedAreOpen,
  t,
}) => {
  const [correctTab, setCorrectTab] = useState(0)

  const { matchingRule = '' } = item?.validation?.validResponse || {}

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, (draft) => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = []
        }
        draft.validation.altResponses.push({
          score: draft?.validation?.validResponse?.score,
          matchingRule,
          value: '',
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

  // The "matchingRule" must have same value for both Correct and Alternate answers
  const handleScoringTypeChange = (value) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.validation.validResponse.matchingRule = value
        draft.validation?.altResponses?.forEach((altResp) => {
          altResp.matchingRule = value
        })
        updateVariables(draft)
      })
    )
  }

  const handleValueChange = (value) => {
    setQuestionData(
      produce(item, (draft) => {
        if (correctTab === 0) {
          draft.validation.validResponse.value = value
        } else {
          draft.validation.altResponses[correctTab - 1].value = value
        }

        updateVariables(draft)
      })
    )
  }

  const renderOptions = () => (
    <ComposeAnswer
      data-cy="correctAnswerShortText"
      title={item.title}
      item={item}
      onSelectChange={handleScoringTypeChange}
      onChange={handleValueChange}
      options={[
        { value: EXACT_MATCH, label: t('component.shortText.exactMatch') },
        { value: CONTAINS, label: t('component.shortText.anyTextContaining') },
      ]}
      selectValue={matchingRule}
      inputValue={
        correctTab === 0
          ? item.validation.validResponse.value
          : item.validation.altResponses[correctTab - 1].value
      }
      isCorrectAnsTab={correctTab === 0}
    />
  )

  return (
    <ContentArea>
      <ComposeQuestion
        data-cy="composeQuestionArea"
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
      />

      <Question
        data-cy="questionArea"
        section="main"
        label={t('component.shortText.correctAnswers')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <CorrectAnswers
          data-cy="CorrectAnswersArea"
          onTabChange={setCorrectTab}
          correctTab={correctTab}
          onAdd={handleAddAnswer}
          validation={item.validation}
          onCloseTab={handleCloseTab}
          fillSections={fillSections}
          cleanSections={cleanSections}
          questionType={item?.title}
          points={
            correctTab === 0
              ? item.validation.validResponse.score
              : item.validation.altResponses[correctTab - 1].score
          }
          onChangePoints={handlePointsChange}
          isCorrectAnsTab={correctTab === 0}
        />
      </Question>

      {advancedLink}

      <Options
        data-cy="Options"
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
        showScoringSection // To show scoring section regardless advanced section is open or close
        item={item}
        extraInScoring={renderOptions()}
        showScoringType={false} // To hide scoring method section inside scoring section
        isCorrectAnsTab={correctTab === 0}
      />
    </ContentArea>
  )
}

EditShortText.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  advancedLink: PropTypes.any,
}

EditShortText.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  advancedLink: null,
}

export default withNamespaces('assessment')(EditShortText)
