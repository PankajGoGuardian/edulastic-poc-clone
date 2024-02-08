import { Tabs } from 'antd'
import React from 'react'
import styled from 'styled-components'
import VideoListContainer from './VideoList/VideoListContainer'

const { TabPane } = Tabs

const VideoLibraryTabs = ({ setCurrentTab, ...rest }) => {
  const handleTabChange = (key) => {
    setCurrentTab(key)
  }

  const { isTestLibraryLoading } = rest

  return (
    <StyledTabs defaultActiveKey="1" onChange={handleTabChange}>
      <TabPane tab="Community" key="1" disabled={isTestLibraryLoading}>
        <VideoListContainer {...rest} />
      </TabPane>
      <TabPane tab="My Content" key="2" disabled={isTestLibraryLoading}>
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
  margin-top: 24px;
  margin-left: 82px;
  width: 100%;
  max-width: 1080px;
`
