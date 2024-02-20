import React from 'react'
import { Layout, Icon, Badge, Tooltip } from 'antd'
import {
  themeColor,
  borderGrey4,
  greyThemeDark4,
  tagTextColor,
  tagsBgColor,
} from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import styled from 'styled-components'
import { IconPearAssessLogoCompact, IconSettings } from '@edulastic/icons'
import { connect } from 'react-redux'
import moment from 'moment'
import { selector } from './ducks'
import Breadcrumb from '../../author/src/components/Breadcrumb'

const { Content } = Layout

function downloadVideo(blob_url, fileName = 'video.webm') {
  const a = document.createElement('a')
  a.href = blob_url
  a.download = fileName
  a.click()
  a.remove()
}

window.downloadVideo = downloadVideo

const VideoDownload = ({ url, filename, time }) => (
  <Tooltip title={`Recorded ${moment(new Date(time)).fromNow()}`}>
    <Badge dot>
      <Icon
        style={{ marginLeft: 15, fontSize: 25 }}
        type="video-camera"
        onClick={() => {
          downloadVideo(url, filename)
        }}
      />
    </Badge>
  </Tooltip>
)

const PageLayout = ({
  children,
  breadcrumbData = [],
  assignmentTitle,
  classTitle,
  showCameraSettings,
  setShowSettings,
  recordedVideo,
}) => (
  <Layout>
    <StyledHeader>
      <IconPearAssessLogoCompact className="logo" height="18" />
      <h2 className="title">SnapScore</h2>
      <h1 className="assignmentTitle">{assignmentTitle}</h1>
      <h3 className="classTitle">{classTitle}</h3>
      {recordedVideo.url ? <VideoDownload {...recordedVideo} /> : null}
      {showCameraSettings ? (
        <SettingsButton
          btnType="primary"
          isBlue
          isGhost
          onClick={() => setShowSettings(true)}
        >
          <IconSettings /> Settings
        </SettingsButton>
      ) : null}
    </StyledHeader>
    <Content style={{ padding: '0 50px' }}>
      <div style={{ padding: '20px 0' }}>
        <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
      </div>

      {children}
    </Content>
  </Layout>
)

export default connect((state) => ({ ...selector(state) }))(PageLayout)

const StyledHeader = styled.div`
  height: 45px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid ${borderGrey4};

  .logo {
    fill: ${themeColor};
    margin-left: 21px;
    margin-right: 6px;
  }

  .title {
    font: italic normal 700 17px/22px Open Sans;
    color: ${themeColor};
    text-align: left;
    margin-top: unset;
    margin-bottom: 2px;
    margin-right: 40px;

    &::after {
      content: '|';
      position: absolute;
      font: normal normal 700 17px/22px Open Sans;
      color: ${borderGrey4};
      margin-left: 15px;
    }
  }

  .assignmentTitle {
    text-align: left;
    font: normal normal bold 17px/22px Open Sans;
    letter-spacing: 0px;
    margin-top: auto;

    color: ${greyThemeDark4};
  }

  .classTitle {
    text-align: left;
    border-radius: 2px;
    font: normal normal bold 8px/11px Open Sans;
    letter-spacing: 0.15px;
    color: ${tagTextColor};
    text-transform: uppercase;
    background: ${tagsBgColor};
    padding: 3px 6px;
    margin-left: 10px;
    margin-top: unset;
    margin-bottom: 2px;
  }
`

const SettingsButton = styled(EduButton)`
  position: absolute;
  right: 21px;
`
