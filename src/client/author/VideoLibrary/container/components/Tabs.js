import { Tabs } from 'antd'
import React from 'react'
import styled from 'styled-components'

import VideoListContainer from './VideoList/VideoListContainer'
import Filters from './Filters'

const { TabPane } = Tabs

const VideoLibraryTabs = ({ setCurrentTab, ...rest }) => {
  const handleTabChange = (key) => {
    setCurrentTab(key)
  }

  const {
    isTestLibraryLoading,
    setFilterGrades,
    setFilterSubjects,
    filterGrades,
    filterSubjects,
    filterStatus,
    setFilterStatus,
  } = rest

  const filterProps = {
    setFilterGrades,
    setFilterSubjects,
    filterGrades,
    filterSubjects,
    filterStatus,
    setFilterStatus,
    isTestLibraryLoading,
  }

  return (
    <StyledTabs defaultActiveKey="1" onChange={handleTabChange}>
      <TabPane tab="Community" key="1" disabled={isTestLibraryLoading}>
        <Filters {...filterProps} />
        <VideoListContainer {...rest} />
      </TabPane>
      <TabPane tab="My Content" key="2" disabled={isTestLibraryLoading}>
        <Filters {...filterProps} />
        <VideoListContainer {...rest} />
      </TabPane>
      <TabPane tab="YouTube" key="3" disabled={isTestLibraryLoading}>
        <VideoListContainer {...rest} />
      </TabPane>
    </StyledTabs>
  )
}

export default VideoLibraryTabs

const StyledTabs = styled(Tabs)`
  padding: 0px 90px;
`
