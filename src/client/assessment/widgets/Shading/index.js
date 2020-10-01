import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PREVIEW, EDIT, CLEAR } from '../../constants/constantsForQuestions'
import { replaceVariables } from '../../utils/variables'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import ShadingPreview from './ShadingPreview'
import ShadingEdit from './ShadingEdit'

const Shading = (props) => {
  const { item, view } = props
  const itemForPreview = useMemo(() => replaceVariables(item), [item])

  return (
    <>
      {view === PREVIEW && <ShadingPreview {...props} item={itemForPreview} />}
      {view === EDIT && <ShadingEdit {...props} />}
    </>
  )
}

Shading.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

Shading.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: null,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

const ShadingContainer = connect(null, {
  setQuestionData: setQuestionDataAction,
})(Shading)

export { ShadingContainer as Shading }
