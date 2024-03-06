import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash'

import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import QuestionTextArea from '../../../components/QuestionTextArea'
import { Subtitle } from '../../../styled/Subtitle'

import { setQuestionDataAction } from '../../../../author/QuestionEditor/ducks'
import Question from '../../../components/Question'

const ComposeQuestion = ({
  item,
  t,
  setQuestionData,
  fillSections,
  cleanSections,
}) => {
  const handleQuestionChange = (value) => {
    const newData = cloneDeep(item)
    newData.stimulus = value
    setQuestionData(newData)
  }

  if (!item) return null

  return (
    <Question
      section="main"
      label={t('component.likertScale.composeQuestion')}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(
          `${item?.title}-${t('component.likertScale.composeQuestion')}`
        )}
      >
        {t('component.likertScale.composeQuestion')}
      </Subtitle>

      <QuestionTextArea
        onChange={handleQuestionChange}
        value={item.stimulus}
        border="border"
      />
    </Question>
  )
}

ComposeQuestion.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

ComposeQuestion.defaultProps = {
  item: {},
  fillSections: () => {},
  cleanSections: () => {},
}

export default compose(
  connect(null, {
    setQuestionData: setQuestionDataAction,
  })
)(ComposeQuestion)
