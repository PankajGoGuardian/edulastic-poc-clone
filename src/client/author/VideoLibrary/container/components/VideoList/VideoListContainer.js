import React from 'react'
import { Spin } from 'antd'
import { EduIf, FlexContainer } from '@edulastic/common'
import { SpinLoader } from '../../styledComponents/videoList'
import VideoList from './VideoList'

const VideoListContainer = ({
  showSpinnerVideoList,
  handleVideoSelect,
  videos = [],
  loaderRef,
  showLoaderButton,
  isLoading = false,
  isTestLibraryLoading,
}) => {
  return (
    <>
      <SpinLoader spinning={showSpinnerVideoList || isTestLibraryLoading}>
        <div>
          <EduIf condition={videos.length}>
            <VideoList videos={videos} handleVideoSelect={handleVideoSelect} />
          </EduIf>
        </div>
      </SpinLoader>
      <EduIf condition={videos.length >= 20 && videos.length % 20 === 0}>
        <FlexContainer justifyContent="center" ref={loaderRef}>
          <EduIf condition={showLoaderButton}>
            <Spin spinning={isLoading} />
          </EduIf>
        </FlexContainer>
      </EduIf>
    </>
  )
}

export default VideoListContainer
