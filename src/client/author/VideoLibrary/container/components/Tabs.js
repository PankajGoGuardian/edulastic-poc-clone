import { Tabs } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import VideoListContainer from './VideoList/VideoListContainer'
import Filters from './FiltersContainer'
import VideoNotFound from './VideoNotFound'
import { vqConst } from '../../const'

const { TabPane } = Tabs
const { COMMUNITY, YOUTUBE, MY_CONTENT } = vqConst.vqTabs

const VideoLibraryTabs = ({
  handleCardSelect,
  handleFilterChanges,
  handleTabSelect,
  vqListData,
  currentTab,
  filterGrades,
  filterStatus,
  filterSubjects,
  showNoData,
  isLoading,
  ytSearchNoResult,
}) => {
  const filterProps = {
    handleFilterChanges,
    currentTab,
    filterGrades,
    filterStatus,
    filterSubjects,
    isLoading,
  }

  const videoListProps = {
    vqListData,
    handleCardSelect,
    isLoading,
    currentTab,
  }

  return (
    <StyledTabs
      defaultActiveKey="community"
      activeKey={currentTab}
      onChange={(selectedTab) => handleTabSelect(selectedTab)}
    >
      <TabPane tab="Community" key={COMMUNITY} disabled={isLoading}>
        <Filters {...filterProps} />
        <EduIf condition={showNoData}>
          <EduThen>
            <VideoNotFound
              setCurrentTab={handleTabSelect}
              heading="We can’t find anything in our library..."
              description="Search directly on YouTube"
            />
          </EduThen>
          <EduElse>
            <VideoListContainer {...videoListProps} />
          </EduElse>
        </EduIf>
      </TabPane>
      <TabPane tab="My Content" key={MY_CONTENT} disabled={isLoading}>
        <Filters {...filterProps} />
        <EduIf condition={showNoData}>
          <EduThen>
            <VideoNotFound
              setCurrentTab={handleTabSelect}
              heading="We can’t find anything in our library..."
              description="Search directly on YouTube"
            />
          </EduThen>
          <EduElse>
            <VideoListContainer {...videoListProps} />
          </EduElse>
        </EduIf>
      </TabPane>
      <TabPane tab="YouTube" key={YOUTUBE} disabled={isLoading}>
        <EduIf condition={showNoData}>
          <EduThen>
            <EduIf condition={ytSearchNoResult}>
              <EduThen>
                <VideoNotFound heading="Can't find a certain video? Please copy and paste the YouTube video link into our search bar." />
              </EduThen>
              <EduElse>
                <VideoNotFound heading="Type the keywords in the above search box to search videos on YouTube." />
              </EduElse>
            </EduIf>
          </EduThen>
          <EduElse>
            <VideoListContainer {...videoListProps} />
          </EduElse>
        </EduIf>
      </TabPane>
    </StyledTabs>
  )
}

export default VideoLibraryTabs

const StyledTabs = styled(Tabs)`
  padding: 0px 90px;
`
