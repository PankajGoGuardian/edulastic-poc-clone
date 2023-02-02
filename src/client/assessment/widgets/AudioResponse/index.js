import React from 'react'
import PropTypes from 'prop-types'

import { WithResources, EduIf } from '@edulastic/common'

import { EDIT, PREVIEW } from '../../constants/constantsForQuestions'

import { ContentArea } from '../../styled/ContentArea'
import AppConfig from '../../../../app-config'
import AudioResponseEdit from './AudioResponseEdit'
import AudioResponsePreview from './AudioResponsePreview'

const AudioResponse = (props) => {
  const { view } = props

  return (
    <WithResources
      resources={[AppConfig.jqueryPath, `${AppConfig.katexPath}/katex.min.js`]}
      fallBack={<span />}
      onLoaded={() => {}}
    >
      <EduIf condition={view === EDIT}>
        <ContentArea>
          <AudioResponseEdit {...props} />
        </ContentArea>
      </EduIf>
      <EduIf condition={view === PREVIEW}>
        <AudioResponsePreview {...props} />
      </EduIf>
    </WithResources>
  )
}

AudioResponse.propTypes = {
  view: PropTypes.string.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

AudioResponse.defaultProps = {
  smallSize: false,
  item: {},
  userAnswer: '',
  fillSections: () => {},
  cleanSections: () => {},
}

export default AudioResponse
