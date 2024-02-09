import { themeColor, white } from '@edulastic/colors'
import { Card, FlexContainer } from '@edulastic/common'
import { Spin } from 'antd'
import styled from 'styled-components'

export const VideoListWrapper = styled(FlexContainer)`
  margin: 5px 0px;
`
export const SpinLoader = styled(Spin)`
  &.ant-spin.ant-spin-spinning {
    position: fixed;
    top: 50%;
    left: calc(50% + 35px); // 35px due to left menu
  }
`

// Following values are in pixel
const channelTitleFontSize = 12
const videoTitleFontSize = channelTitleFontSize + 2
const subHeaderFontSize = 16
const videoDurationFontSize = videoTitleFontSize

// VideoThubmnail+marginBetween+FooterTextWrapper+verticalPadding

export const VideoTitleText = styled.span`
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #000;
  font-family: Open Sans;
  font-size: ${`${videoTitleFontSize}px`};
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 4px;
`

export const VideoCard = styled(Card)`
  border: none;
  box-shadow: none;
  margin-bottom: 4px;
  .ant-card-body {
    padding: 0px;
    height: ${({ channelTitle }) =>
      channelTitle ? `${180 + 68.5 + 10}px` : `${180 + 52 + 10}px`}} 
    width: ${({ width }) => width && `${width}`};
    overflow: hidden;
  }
  :hover {
    box-shadow: 0 0 3px 2px ${themeColor};
  }
`
export const VideoThumbnail = styled.div`
  border-radius: 8px;
  background-image: ${({ imgSrc }) => `url(${imgSrc})`};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  border: 1px solid #d9d9d9;
`
export const SubHeader = styled.div`
  color: #434b5d;
  font-family: Open Sans;
  font-size: ${`${subHeaderFontSize}px`};
  font-style: normal;
  font-weight: 600;
  line-height: ${`${subHeaderFontSize * 1.5}px`};
  letter-spacing: ${-`${subHeaderFontSize / 100}px`};
  max-width: ${({ maxWidth }) => `${maxWidth}`};
  display: ${({ maxWidth }) => maxWidth && '-webkit-box'};
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: ${({ mb }) => mb};
`
export const LightSubHeader = styled.span`
  color: #777;
  font-family: Open Sans;
  font-size: ${`${subHeaderFontSize}px`};
  font-style: normal;
  font-weight: 400;
  line-height: ${`${subHeaderFontSize * 1.5}px`};
  letter-spacing: ${-`${subHeaderFontSize / 100}px`};
`

export const VideoTitleWrapper = styled(FlexContainer)`
  margin-top: 10px;
`
export const ChannelTitleText = styled.span`
  color: #777;
  font-family: Open Sans;
  font-size: ${`${channelTitleFontSize}px`};
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const VideoDuration = styled.span`
  border-radius: 4px;
  background: #000;
  color: ${white};
  padding: 4px;
  font-family: Open Sans;
  font-size: ${`${videoDurationFontSize}px`};
  font-style: normal;
  font-weight: 600;
  margin: 4px;
  line-height: ${`${videoDurationFontSize}px`}; ;
`
export const VideoTextWrapper = styled.div`
  padding: 5px;
  margin-top: 5px;
`
