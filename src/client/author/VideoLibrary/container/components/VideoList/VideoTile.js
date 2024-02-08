import React from 'react'
import { Tooltip } from 'antd'
import { FlexContainer } from '@edulastic/common'

import { parseISO8601Duration } from '../../../../AssessmentCreate/components/CreateVideoQuiz/utils'
import {
  ChannelTitleText,
  VideoCard,
  VideoDuration,
  VideoTextWrapper,
  VideoThumbnail,
  VideoTitleText,
} from '../../styledComponents/videoList'

/**
 * VideoTile component
 *
 * @description Renders a VideoTile with the provided video details and handleVideoClick handler.
 *
 * @param {object} video The Video Details to display on the Video Tile.
 * @param {function} handleVideoClick The onClick handler for the VideoCard.
 *
 */
const VideoTile = ({ video, handleVideoClick }) => {
  const handleOnClick = () => {
    handleVideoClick(`https://www.youtube.com/watch?v=${video?.id?.videoId}`)
  }
  return (
    <VideoCard bordered={false} hoverable onClick={handleOnClick}>
      <VideoThumbnail
        imgSrc={video?.snippet?.thumbnails?.medium?.url}
        alt={video?.snippet?.title}
        width="100%"
        height="180px"
      >
        <FlexContainer
          width="100%"
          height="100%"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <VideoDuration>
            {parseISO8601Duration(
              video?.videoDetails?.contentDetails?.duration
            )}
          </VideoDuration>
        </FlexContainer>
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
          title={video?.snippet?.channelTitle}
          placement="bottomLeft"
        >
          <ChannelTitleText>{video?.snippet?.channelTitle}</ChannelTitleText>
        </Tooltip>
      </VideoTextWrapper>
    </VideoCard>
  )
}

export default VideoTile
