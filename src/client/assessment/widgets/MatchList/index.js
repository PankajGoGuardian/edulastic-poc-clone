import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { replaceVariables } from '../../utils/variables'
import { PREVIEW, EDIT, CLEAR } from '../../constants/constantsForQuestions'
import { changePreviewAction } from '../../../author/src/actions/view'
import MatchListPreview from './MatchListPreview'
import MatchListEdit from './MatchListEdit'

const MatchList = (props) => {
  const { item, view } = props
  const itemForPreview = useMemo(() => replaceVariables(item), [item])
  return (
    <>
      {view === PREVIEW && itemForPreview && (
        <MatchListPreview {...props} showBorder item={itemForPreview} />
      )}
      {view === EDIT && <MatchListEdit {...props} />}
    </>
  )
}

MatchList.propTypes = {
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

MatchList.defaultProps = {
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

const MatchListContainer = connect(null, {
  changePreview: changePreviewAction,
})(MatchList)

export { MatchListContainer as MatchList }
