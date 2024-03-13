import React from 'react'
import { Tooltip } from 'antd'
import { FlexContainer } from '@edulastic/common'

import {
  VideoTitleText,
  VideoCard,
  VideoThumbnail,
  ChannelTitleText,
  VideoDuration,
  VideoTextWrapper,
} from '../styledComponents/videoList'
import { parseISO8601Duration } from '../utils'

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
  video: { videoDetails = {} } = {},
  handleVideoSelect = () => {},
}) => {
  const { id, contentDetails = {}, snippet = {} } = videoDetails
  const { title = '', thumbnails = {}, channelTitle = '' } = snippet
  const { medium: { url = '', height = '' } = {} } = thumbnails
  const { duration = '' } = contentDetails

  const handleOnClick = () => {
    handleVideoSelect(id, title)
  }

  return (
    <VideoCard bordered={false} hoverable onClick={handleOnClick}>
      <VideoThumbnail imgSrc={url} alt={title} height={`${height}px`}>
        <FlexContainer
          width="100%"
          height="100%"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <VideoDuration>{parseISO8601Duration(duration)}</VideoDuration>
        </FlexContainer>
      </VideoThumbnail>
      <VideoTextWrapper>
        <Tooltip
          mouseEnterDelay={1}
          mouseLeaveDelay={1}
          title={title}
          placement="bottomLeft"
        >
          <VideoTitleText>{title}</VideoTitleText>
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
  )
}

export default VideoTile
