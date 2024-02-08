import React from 'react'
import { Spin } from 'antd'
import { EduElse, EduIf, EduThen, FlexContainer } from '@edulastic/common'
import { SpinLoader } from '../../styledComponents/videoList'
import VideoList from './VideoList'

const VideoListContainer = ({
  showSpinnerVideoList,
  setLinkValue,
  videos = [],
  showNoData,
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
            <EduThen>
              <VideoList videos={videos} setLinkValue={setLinkValue} />
            </EduThen>
            <EduElse>
              <EduIf condition={showNoData}>
                {/* <NoDataNotification heading="No results found" /> */}
              </EduIf>
            </EduElse>
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
