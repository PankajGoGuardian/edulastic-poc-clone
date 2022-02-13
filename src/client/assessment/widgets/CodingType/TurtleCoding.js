import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { replaceVariables } from '../../utils/variables'

import { CLEAR, EDIT, PREVIEW } from '../../constants/constantsForQuestions'

import EditTurtlePlainText from './components/EditTurtlePlainText'
import TurtleQuestionPreview from './TurtleQuestionPreview'

const EssayPlainText = (props) => {
  const { item, view, disableResponse, isPrintPreview } = props
  return (
    <>
      {view === EDIT && <EditTurtlePlainText {...props} />}
      {view === PREVIEW && (
        <TurtleQuestionPreview
          key={item.id}
          {...props}
          disableResponse={disableResponse || isPrintPreview}
        />
      )}
    </>
  )
}

EssayPlainText.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

EssayPlainText.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: '',
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

const TurtleContainer = connect(null, {
  setQuestionData: setQuestionDataAction,
})(EssayPlainText)

export { TurtleContainer as TurtleCoding }
