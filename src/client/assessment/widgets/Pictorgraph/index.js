import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { WithResources } from '@edulastic/common'

import { EDIT, PREVIEW, CLEAR } from '../../constants/constantsForQuestions'
import { replaceVariables } from '../../utils/variables'

import { ContentArea } from '../../styled/ContentArea'
import AppConfig from '../../../../app-config'
import EditPictograph from './EditPictograph'
import PreviewPictograph from './PreviewPictograph'

const Pictograph = (props) => {
  const { view, item } = props
  const itemForPreview = useMemo(() => replaceVariables(item), [item])

  return (
    <WithResources
      resources={[AppConfig.jqueryPath, `${AppConfig.katexPath}/katex.min.js`]}
      fallBack={<span />}
      onLoaded={() => {}}
    >
      {view === EDIT && (
        <ContentArea>
          <EditPictograph {...props} item={item} />
        </ContentArea>
      )}
      {view === PREVIEW && (
        <PreviewPictograph
          {...props}
          item={itemForPreview}
          droppedChoices={item.droppedChoices}
          showClassName={item.showClassName}
        />
      )}
    </WithResources>
  )
}

Pictograph.propTypes = {
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

Pictograph.defaultProps = {
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

export default Pictograph
