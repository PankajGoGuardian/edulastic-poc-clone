import React from 'react'
import i18 from '@edulastic/localization'
import { EduIf, MainHeader } from '@edulastic/common'
import { IconVideoLibrary } from '@edulastic/icons'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { showVQCountSelector } from '../../../src/selectors/user'
import VideoQuizUsage from './VideoQuizUsage'

const VideoLibraryHeader = ({ showVqCount }) => {
  return (
    <StyledMainHeader
      Icon={() => <IconVideoLibrary height={22} width={30} />}
      headingText={i18.t('header:common.vqLibrary')}
    >
      <EduIf condition={showVqCount}>
        <StyledUsageCountWrapper>
          <VideoQuizUsage videoQuizLibrary />
        </StyledUsageCountWrapper>
      </EduIf>
    </StyledMainHeader>
  )
}

const StyledMainHeader = styled(MainHeader)`
  h1 {
    min-width: 0px;
  }
`
const StyledUsageCountWrapper = styled.div`
  padding-left: 32px;
  div {
    justify-content: left;
  }
  width: 100%;
`
const enhance = compose(
  connect((state) => ({
    showVqCount: showVQCountSelector(state),
  }))
)

export default enhance(VideoLibraryHeader)
