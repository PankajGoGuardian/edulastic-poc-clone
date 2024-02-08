import { Tabs } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import VideoListContainer from './VideoList/VideoListContainer'
import Filters from './Filters'
import VideoNotFound from './VideoNotFound'

const { TabPane } = Tabs

const VideoLibraryTabs = ({ showNoData, hasSearchedText, ...rest }) => {
  const {
    isTestLibraryLoading,
    setFilterGrades,
    setFilterSubjects,
    filterGrades,
    filterSubjects,
    filterStatus,
    setFilterStatus,
    setCurrentTab,
    currentTab,
  } = rest

  const handleTabChange = (key) => {
    setCurrentTab(key)
  }

  const filterProps = {
    setFilterGrades,
    setFilterSubjects,
    filterGrades,
    filterSubjects,
    filterStatus,
    setFilterStatus,
    isTestLibraryLoading,
    currentTab,
  }

  return (
    <StyledTabs
      defaultActiveKey="1"
      activeKey={currentTab}
      onChange={handleTabChange}
    >
      <TabPane tab="Community" key="1" disabled={isTestLibraryLoading}>
        <Filters {...filterProps} />
        <EduIf condition={showNoData}>
          <EduThen>
            <VideoNotFound
              setCurrentTab={setCurrentTab}
              heading="We can’t find anything in our library..."
              description="Search directly on YouTube"
            />
          </EduThen>
          <EduElse>
            <VideoListContainer {...rest} />
          </EduElse>
        </EduIf>
      </TabPane>
      <TabPane tab="My Content" key="2" disabled={isTestLibraryLoading}>
        <Filters {...filterProps} />
        <EduIf condition={showNoData}>
          <EduThen>
            <VideoNotFound
              setCurrentTab={setCurrentTab}
              heading="We can’t find anything in our library..."
              description="Search directly on YouTube"
            />
          </EduThen>
          <EduElse>
            <VideoListContainer {...rest} />
          </EduElse>
        </EduIf>
      </TabPane>
      <TabPane tab="YouTube" key="3" disabled={isTestLibraryLoading}>
        <EduIf condition={showNoData}>
          <EduThen>
            <EduIf condition={hasSearchedText}>
              <EduThen>
                <VideoNotFound heading="Can't find a certain video? Please copy and paste the YouTube video link into our search bar." />
              </EduThen>
              <EduElse>
                <VideoNotFound heading="Type the keywords in the above search box to search videos on YouTube." />
              </EduElse>
            </EduIf>
          </EduThen>
          <EduElse>
            <VideoListContainer {...rest} />
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
