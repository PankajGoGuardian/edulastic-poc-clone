import React from 'react'
import PropTypes from 'prop-types'

import { WithResources } from '@edulastic/common'

import { EDIT, PREVIEW } from '../../constants/constantsForQuestions'

import { ContentArea } from '../../styled/ContentArea'
import AppConfig from '../../../../app-config'
import EditLikertScale from './EditLikertScale'
import LikertScalePreview from './LikertScalePreview'

const LikertScale = (props) => {
  const { view } = props

  return (
    <WithResources
      resources={[AppConfig.jqueryPath, `${AppConfig.katexPath}/katex.min.js`]}
      fallBack={<span />}
      onLoaded={() => {}}
    >
      {view === EDIT && (
        <ContentArea>
          <EditLikertScale {...props} />
        </ContentArea>
      )}
      {view === PREVIEW && <LikertScalePreview {...props} />}
    </WithResources>
  )
}

LikertScale.propTypes = {
  view: PropTypes.string.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

LikertScale.defaultProps = {
  smallSize: false,
  item: {},
  userAnswer: '',
  fillSections: () => {},
  cleanSections: () => {},
}

export default LikertScale
