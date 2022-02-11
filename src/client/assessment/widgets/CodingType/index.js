import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { replaceVariables } from '../../utils/variables'

import { CLEAR, EDIT, PREVIEW } from '../../constants/constantsForQuestions'

import EditEssayPlainText from './components/EditEssayPlainText'
import EssayPlainTextPreview from './EssayPlainTextPreview'

const EssayPlainText = (props) => {
  const { item, view, disableResponse, isPrintPreview } = props

  const itemForPreview = useMemo(() => replaceVariables(item), [item])

  return (
    <>
      {view === EDIT && <EditEssayPlainText {...props} />}
      {view === PREVIEW && (
        <EssayPlainTextPreview
          key={itemForPreview.id}
          {...props}
          item={itemForPreview}
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

const EssayPlainTextContainer = connect(null, {
  setQuestionData: setQuestionDataAction,
})(EssayPlainText)

export { EssayPlainTextContainer as Coding }
