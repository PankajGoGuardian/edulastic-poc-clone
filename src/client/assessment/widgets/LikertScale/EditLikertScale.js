import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { withNamespaces } from '@edulastic/localization'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { removeUserAnswerAction } from '../../actions/answers'
import ComposeQuestion from './components/ComposeQuestion'
import ScaleOptions from './components/ScaleOptions'
import Layout from './components/Layout'
import { scaleData } from './constants'

const EditLikertScale = ({
  t,
  item,
  setQuestionData,
  fillSections,
  cleanSections,
  view,
  saveAnswer,
  userAnswer,
  removeAnswer,
}) => {
  return (
    <>
      <ComposeQuestion
        t={t}
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <ScaleOptions
        t={t}
        item={item}
        setQuestionData={setQuestionData}
        fillSections={fillSections}
        cleanSections={cleanSections}
        scaleData={scaleData}
        view={view}
        saveAnswer={saveAnswer}
        userAnswer={userAnswer}
        removeAnswer={removeAnswer}
      />

      <Layout
        t={t}
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
        setQuestionData={setQuestionData}
      />
    </>
  )
}

EditLikertScale.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.string,
  removeAnswer: PropTypes.func.isRequired,
}

EditLikertScale.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  userAnswer: '',
}

const enhance = compose(
  withNamespaces('assessment'),
  withTheme,
  connect(null, {
    setQuestionData: setQuestionDataAction,
    removeAnswer: removeUserAnswerAction,
  })
)

export default enhance(EditLikertScale)
