import React, { useState } from 'react'
import { Tooltip } from 'antd'
import { EduIf, FlexContainer } from '@edulastic/common'
import { compose } from 'redux'
import { withRouter } from 'react-router'

import IconSmallCircle from '@edulastic/icons/src/IconSmallCircle'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
  ChannelTitleText,
  VideoCard,
  VideoDuration,
  VideoTextWrapper,
  VideoThumbnail,
  VideoTitleText,
} from '../../styledComponents/videoList'
import BuyAISuiteAlertModal from '../../../../../common/components/BuyAISuiteAlertModal'
import { allowedToCreateVideoQuizSelector } from '../../../../src/selectors/user'
import { vqConst } from '../../../const'

/**
 * VideoTile component
 *
 * @description Renders a VideoTile with the provided video details and handleVideoClick handler.
 *
 * @param {object} video The Video Details to display on the Video Tile.
 * @param {function} handleVideoClick The onClick handler for the VideoCard.
 *
 */
const VideoTile = ({
  key,
  vqCardData,
  handleCardSelect,
  currentTab,
  allowedToCreateVideoQuiz,
  history,
}) => {
  const [isAddOnAlertVisible, setIsAddOnAlertVisible] = useState(false)
  const {
    id,
    duration,
    subTitle,
    thumbnailUrl,
    title,
    totalQuestions,
  } = vqCardData
  const handleOnClick = () => {
    if (currentTab === vqConst.vqTabs.YOUTUBE) {
      if (allowedToCreateVideoQuiz) {
        handleCardSelect(id, title)
      } else {
        setIsAddOnAlertVisible((prevState) => !prevState)
      }
    } else {
      handleCardSelect(id)
    }
  }

  return (
    <>
      <VideoCard key={key} bordered={false} hoverable onClick={handleOnClick}>
        <VideoThumbnail
          imgSrc={thumbnailUrl}
          alt={title}
          width="100%"
          height="180px"
        >
          <EduIf condition={duration}>
            <FlexContainer
              width="100%"
              height="100%"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <VideoDuration>{duration}</VideoDuration>
            </FlexContainer>
          </EduIf>
        </VideoThumbnail>
        <VideoTextWrapper>
          <Tooltip
            mouseEnterDelay={1}
            mouseLeaveDelay={1}
            title={title}
            placement="bottomLeft"
          >
            <VideoTitleText>{title}</VideoTitleText>
          </Tooltip>
          <Tooltip
            mouseEnterDelay={1}
            mouseLeaveDelay={1}
            title={subTitle}
            placement="bottomLeft"
          >
            <FlexContainer justifyContent="flex-start" alignItems="center">
              <ChannelTitleText
                maxWidth={totalQuestions ? '65%' : '100%'}
                margin="0 5px 0 0"
              >
                {subTitle}
              </ChannelTitleText>
              <EduIf condition={totalQuestions}>
                <>
                  <IconWrapper margin="0 5px 0 0">
                    <IconSmallCircle />
                  </IconWrapper>
                  <ChannelTitleText>{totalQuestions} Items</ChannelTitleText>
                </>
              </EduIf>
            </FlexContainer>
          </Tooltip>
        </VideoTextWrapper>
      </VideoCard>
      <BuyAISuiteAlertModal
        isVisible={isAddOnAlertVisible}
        setAISuiteAlertModalVisibility={setIsAddOnAlertVisible}
        history={history}
        isClosable={false}
        stayOnSamePage
        key={key}
      />
    </>
  )
}

const enhanced = compose(
  withRouter,
  connect((state) => ({
    allowedToCreateVideoQuiz: allowedToCreateVideoQuizSelector(state),
  }))
)

export default enhanced(VideoTile)

const IconWrapper = styled(IconSmallCircle)`
  margin: ${({ margin }) => margin};
`
