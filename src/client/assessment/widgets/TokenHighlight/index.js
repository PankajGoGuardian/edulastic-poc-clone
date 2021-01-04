import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import produce from 'immer'

import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { PREVIEW, EDIT, CLEAR } from '../../constants/constantsForQuestions'
import { replaceVariables } from '../../utils/variables'
import TokenHighlightPreview from './TokenHighlightPreview'
import TokenHighlightEdit from './TokenHighlightEdit'
import { changeDataToPreferredLanguage } from '../ClozeText/helpers'

const TokenHighlight = (props) => {
  const { view, preferredLanguage } = props
  let { item } = props
  if (
    preferredLanguage !== 'en' &&
    item?.languageFeatures?.[preferredLanguage]
  ) {
    item = produce(item, (draft) => {
      changeDataToPreferredLanguage(
        draft,
        item.languageFeatures[preferredLanguage]
      )
    })
  }
  const itemForPreview = useMemo(() => replaceVariables(item), [item])

  return (
    <>
      {view === PREVIEW && (
        <TokenHighlightPreview {...props} item={itemForPreview} />
      )}
      {view === EDIT && <TokenHighlightEdit {...props} />}
    </>
  )
}

TokenHighlight.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

TokenHighlight.defaultProps = {
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

const TokenHighlightContainer = connect(null, {
  setQuestionData: setQuestionDataAction,
})(TokenHighlight)

export { TokenHighlightContainer as TokenHighlight }
