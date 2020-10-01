import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { replaceVariables } from '../../utils/variables'

import { PREVIEW, EDIT, CLEAR } from '../../constants/constantsForQuestions'

import HighlightImagePreview from './HighlightImagePreview'
import HighlightImageEdit from './components/HighlightImageEdit'

const HighlightImage = (props) => {
  const { item, view } = props
  const itemForPreview = useMemo(() => replaceVariables(item), [item])

  return (
    <>
      {view === PREVIEW && (
        <HighlightImagePreview {...props} item={itemForPreview} />
      )}
      {view === EDIT && <HighlightImageEdit {...props} />}
    </>
  )
}

HighlightImage.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

HighlightImage.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: '',
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false,
}

const HighlightImageContainer = connect(null, {
  setQuestionData: setQuestionDataAction,
})(HighlightImage)

export { HighlightImageContainer as HighlightImage }
