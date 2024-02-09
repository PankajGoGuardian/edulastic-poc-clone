import React, { useState } from 'react'
import { Tooltip } from 'antd'
import { EduIf, FlexContainer } from '@edulastic/common'

import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { parseISO8601Duration } from '../../../../AssessmentCreate/components/CreateVideoQuiz/utils'
import {
  ChannelTitleText,
  VideoCard,
  VideoDuration,
  VideoTextWrapper,
  VideoThumbnail,
  VideoTitleText,
} from '../../styledComponents/videoList'
import { allowedToCreateVideoQuizSelector } from '../../../../src/selectors/user'
import BuyAISuiteAlertModal from '../../../../../common/components/BuyAISuiteAlertModal'

/**
 * VideoTile component
 *
 * @description Renders a VideoTile with the provided video details and handleVideoClick handler.
 *
 * @param {object} video The Video Details to display on the Video Tile.
 * @param {function} handleVideoClick The onClick handler for the VideoCard.
 *
 */
const VideoTile = ({
  video,
  handleVideoClick,
  allowedToCreateVideoQuiz,
  history,
}) => {
  const [isAddOnAlertVisible, setIsAddOnAlertVisible] = useState(false)
  const handleOnClick = () => {
    if (allowedToCreateVideoQuiz) {
      handleVideoClick(`https://www.youtube.com/watch?v=${video?.id?.videoId}`)
    } else {
      setIsAddOnAlertVisible((prevState) => !prevState)
    }
  }
  const videoDuration = parseISO8601Duration(
    video?.videoDetails?.contentDetails?.duration
  )

  const channelTitle = video?.snippet?.channelTitle

  return (
    <>
      <VideoCard
        channelTitle={!!channelTitle}
        bordered={false}
        hoverable
        onClick={handleOnClick}
      >
        <VideoThumbnail
          imgSrc={video?.snippet?.thumbnails?.medium?.url}
          alt={video?.snippet?.title}
          width="100%"
          height="180px"
        >
          <EduIf condition={videoDuration}>
            <FlexContainer
              width="100%"
              height="100%"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <VideoDuration>{videoDuration}</VideoDuration>
            </FlexContainer>
          </EduIf>
        </VideoThumbnail>
        <VideoTextWrapper>
          <Tooltip
            mouseEnterDelay={1}
            mouseLeaveDelay={1}
            title={video?.snippet?.title}
            placement="bottomLeft"
          >
            <VideoTitleText>{video?.snippet?.title}</VideoTitleText>
          </Tooltip>
          <Tooltip
            mouseEnterDelay={1}
            mouseLeaveDelay={1}
            title={channelTitle}
            placement="bottomLeft"
          >
            <ChannelTitleText>{channelTitle}</ChannelTitleText>
          </Tooltip>
        </VideoTextWrapper>
      </VideoCard>
      <BuyAISuiteAlertModal
        isVisible={isAddOnAlertVisible}
        setAISuiteAlertModalVisibility={setIsAddOnAlertVisible}
        history={history}
        isClosable={false}
        stayOnSamePage
      />
    </>
  )
}

const enhanced = compose(
  withRouter,
  connect((state) => ({
    allowedToCreateVideoQuiz: allowedToCreateVideoQuizSelector(state),
  }))
)

export default enhanced(VideoTile)
