import { Col, Row } from 'antd'
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
const VideoList = ({ videos, handleVideoSelect }) => {
  return (
    <FlexContainer width="90%" justifyContent="center" flexDirection="row">
      <Row gutter={[20, 20]}>
        {videos.map((video, index) => {
          return (
            <Col sm={12} md={8} xl={6} key={`${video?.id?.videoId}-${index}`}>
              <VideoTile video={video} handleVideoSelect={handleVideoSelect} />
            </Col>
          )
        })}
      </Row>
    </FlexContainer>
  )
}

export default VideoList
