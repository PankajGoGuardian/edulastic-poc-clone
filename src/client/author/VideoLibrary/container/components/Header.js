import React from 'react'
import i18 from '@edulastic/localization'
import { EduIf, MainHeader } from '@edulastic/common'
import { IconVideoLibrary } from '@edulastic/icons'
import { connect } from 'react-redux'
import { compose } from 'redux'
import VideoQuizUsage from '../../../AssessmentCreate/components/OptionVideo/VideoQuizUsage'
import { showVQCountSelector } from '../../../src/selectors/user'

const VideoLibraryHeader = ({ showVqCount }) => {
  return (
    <MainHeader
      Icon={IconVideoLibrary}
      headingText={i18.t('header:common.vqLibrary')}
    >
      <EduIf condition={showVqCount}>
        <VideoQuizUsage videoQuizLibrary />
      </EduIf>
    </MainHeader>
  )
}
const enhance = compose(
  connect((state) => ({
    showVqCount: showVQCountSelector(state),
  }))
)

export default enhance(VideoLibraryHeader)
