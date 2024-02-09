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
const VideoList = ({ videos, handleVideoSelect }) => {
  return (
    <GridContainer>
      {videos.map((video, index) => {
        return (
          <VideoTile
            key={`${video?.id?.videoId}-${index}`}
            video={video}
            handleVideoClick={handleVideoSelect}
          />
        )
      })}
    </GridContainer>
  )
}

export default VideoList

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Define 5 equal columns */
  grid-gap: 32px; /* Add spacing between items (optional) */
  @media (min-width: 1024px) {
    /* Styles for screens between 768px and 1024px wide */
    grid-template-columns: repeat(3, 1fr); /* Define 5 equal columns */
  }
  @media (min-width: 1366px) {
    /* Styles for screens between 768px and 1024px wide */
    grid-template-columns: repeat(4, 1fr); /* Define 5 equal columns */
  }

  @media (min-width: 1600px) {
    /* Styles for screens between 768px and 1024px wide */
    grid-template-columns: repeat(5, 1fr); /* Define 5 equal columns */
  }
  @media (min-width: 1900px) {
    /* Styles for screens between 768px and 1024px wide */
    grid-template-columns: repeat(6, 1fr); /* Define 5 equal columns */
  }
`
