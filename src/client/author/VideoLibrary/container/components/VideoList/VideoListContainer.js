import React from 'react'
import { EduIf } from '@edulastic/common'
import { SpinLoader } from '../../styledComponents/videoList'
import VideoList from './VideoList'

const VideoListContainer = ({
  vqListData,
  handleCardSelect,
  isLoading,
  currentTab,
}) => {
  return (
    <SpinLoader spinning={isLoading}>
      <div>
        <EduIf condition={vqListData.length}>
          <VideoList
            currentTab={currentTab}
            vqListData={vqListData}
            handleCardSelect={handleCardSelect}
          />
        </EduIf>
      </div>
    </SpinLoader>
  )
}

export default VideoListContainer
