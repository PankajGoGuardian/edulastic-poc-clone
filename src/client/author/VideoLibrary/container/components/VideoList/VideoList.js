import { FlexContainer } from '@edulastic/common'

import React from 'react'
import VideoTile from './VideoTile'

/**
 * VideoList component
 *
 * @description Renders a VideoList with the provided videos and setLinkValue.
 *
 * @param {[object]} videos The Array of video data to display on the VideoList within VideoTile.
 * @param {function} setLinkValue The setLinkValue is provide to VideoTile as handleVideoClick.
 *
 */
const VideoList = ({ videos, setLinkValue }) => {
  return (
    <FlexContainer
      flexWrap="wrap"
      justifyContent="flex-start"
      flexDirection="row"
    >
      {videos.map((video, index) => {
        return (
          <FlexContainer
            marginLeft="10px"
            mr="10px"
            marginBottom="10px"
            mt="10px"
            key={`${video?.id?.videoId}-${index}`}
          >
            <VideoTile video={video} handleVideoClick={setLinkValue} />
          </FlexContainer>
        )
      })}
    </FlexContainer>
  )
}

export default VideoList
