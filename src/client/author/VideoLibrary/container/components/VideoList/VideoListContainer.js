import React from 'react'
import { EduElse, EduIf, EduThen, FlexContainer } from '@edulastic/common'
import { SpinLoader } from '../../styledComponents/videoList'
import VideoList from './VideoList'
import { vqConst } from '../../../const'

const VideoListContainer = ({
  vqListData,
  handleCardSelect,
  loaderRefTestLibrary,
  loaderRefYTLibrary,
  isLoading,
  isTestLibraryLoading,
  currentTab,
}) => {
  return (
    <>
      <SpinLoader spinning={isLoading || isTestLibraryLoading}>
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
      <EduIf condition={!isLoading && vqListData.length >= 20}>
        <EduIf condition={currentTab === vqConst.vqTabs.YOUTUBE}>
          <EduThen>
            <FlexContainer justifyContent="center" ref={loaderRefYTLibrary} />
          </EduThen>
          <EduElse>
            <FlexContainer justifyContent="center" ref={loaderRefTestLibrary} />
          </EduElse>
        </EduIf>
      </EduIf>
    </>
  )
}

export default VideoListContainer
