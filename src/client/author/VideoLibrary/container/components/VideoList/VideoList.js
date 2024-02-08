import React from 'react'
import styled from 'styled-components'
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
    <GridContainer>
      {videos.map((video, index) => {
        return (
          <VideoTile
            key={`${video?.id?.videoId}-${index}`}
            video={video}
            handleVideoClick={setLinkValue}
          />
        )
      })}
    </GridContainer>
  )
}

export default VideoList

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Define 5 equal columns */
  grid-gap: 32px; /* Add spacing between items (optional) */
`
