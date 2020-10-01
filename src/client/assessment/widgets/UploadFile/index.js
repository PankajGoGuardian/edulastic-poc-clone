import React, { useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { CLEAR, EDIT, PREVIEW } from '../../constants/constantsForQuestions'
import { replaceVariables } from '../../utils/variables'
import UploadFileEdit from './components/UploadFileEdit'
import UploadFilePreview from './components/UploadFilePreview'

const UploadFile = (props) => {
  const { item, view } = props
  const itemForPreview = useMemo(() => replaceVariables(item), [item])

  return (
    <>
      {view === EDIT && <UploadFileEdit {...props} />}
      {view === PREVIEW && (
        <UploadFilePreview
          key={itemForPreview.id}
          {...props}
          item={itemForPreview}
        />
      )}
    </>
  )
}

UploadFile.propTypes = {
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

UploadFile.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: undefined,
  testItem: false,
  evaluation: '',
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

export default connect(null, { setQuestionData: setQuestionDataAction })(
  UploadFile
)
