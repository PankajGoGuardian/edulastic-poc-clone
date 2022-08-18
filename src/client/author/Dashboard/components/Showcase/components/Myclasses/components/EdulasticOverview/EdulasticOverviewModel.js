import React, { useState, useEffect } from 'react'

import { greenDark } from '@edulastic/colors'
import { IconDemoAccGreen, IconPlayButton } from '@edulastic/icons'

import styled from 'styled-components'
import EdulasticResourceModal from '../../../../../../../CurriculumSequence/components/ManageContentBlock/components/common/EdulasticResourceModal'
import { proxyDemoPlaygroundUser } from '../../../../../../../authUtils'
import EmbeddedSplitPaneModal from '../EmbeddedSplitPaneModal'

const EdulasticOverviewModel = ({
  handleBannerModalClose,
  isBannerModalVisible,
  setShowBannerModal,
  windowWidth,
}) => {
  const [isVideoPreview, setIsVideoPreview] = useState(false)
  const handleVideoClick = () => {
    setIsVideoPreview(true)
  }

  const { title } = isBannerModalVisible || {}
  const showVideoModal = title === 'Quick Start Guide'

  useEffect(() => {
    if (showVideoModal) {
      setIsVideoPreview(true)
    }
  }, [])

  const handleDemoClick = (event) => {
    event.stopPropagation()
    proxyDemoPlaygroundUser()
  }

  const handlePreviewModalClose = () => {
    setIsVideoPreview(false)
    setShowBannerModal(null)
  }
  return isVideoPreview ? (
    <EmbeddedSplitPaneModal
      closeCallback={handlePreviewModalClose}
      isVisible={isBannerModalVisible} // isBannerModalVisible will have the video preview title and url
      modalWidth={windowWidth < 1200 ? '94%' : '1140px'}
      titleFontSize="22px"
      padding="25px 0px 25px 45px"
      windowWidth={windowWidth}
    />
  ) : (
    <EdulasticResourceModal
      headerText="Getting Started"
      closeCallback={handleBannerModalClose}
      hideFooter
      isVisible={isBannerModalVisible}
    >
      <ModalBody>
        <ContentHeaderDiv>
          <span>Here are some resources to help you get onboarded.</span>
        </ContentHeaderDiv>
        <StyledDiv>
          <StyledButton onClick={handleVideoClick}>
            <IconPlayButton />
          </StyledButton>
          <StyledDescSpan>
            <StyledSpan onClick={handleVideoClick}>
              Quick start guide
            </StyledSpan>
            : Get up and running in less than 20 minutes.
          </StyledDescSpan>
        </StyledDiv>
        <StyledDiv>
          <StyledButton onClick={handleDemoClick}>
            <IconDemoAccGreen />
          </StyledButton>
          <StyledDescSpan>
            <StyledSpan onClick={handleDemoClick}>
              Explore Edulastic Demo playground
            </StyledSpan>
            : Access a demo account and explore all the features, including
            Premium.
          </StyledDescSpan>
        </StyledDiv>
        <StyledExtraResourceDiv>
          <span>Extra Resources:</span>
          <StyledExtraResourceContentDiv>
            <ExtraResourceSpan>
              <a
                href="https://www.youtube.com/watch?v=A5785Ai_ARI&utm_source=Application&utm_medium=Clicks&utm_campaign=Dashboard_Quick_Start_Overview"
                target="_blank"
                rel="noreferrer"
                data-cy="edu-tutorials"
              >
                Edulastic Tutorial
              </a>
            </ExtraResourceSpan>
            <ExtraResourceSpan width="42%">
              <a
                href="https://tinyurl.com/yy8mbunh"
                target="_blank"
                rel="noreferrer"
                data-cy="handbook"
              >
                Getting Started Handbook
              </a>
            </ExtraResourceSpan>
            <ExtraResourceSpan>
              <a
                href="https://edulastic.teachable.com/courses"
                target="_blank"
                rel="noreferrer"
                data-cy="sp-training"
              >
                Self Paced Training
              </a>
            </ExtraResourceSpan>
            <ExtraResourceSpan>
              <a
                href="https://edulastic.com/help-center/"
                target="_blank"
                rel="noreferrer"
                data-cy="help-center"
              >
                Help Center
              </a>
            </ExtraResourceSpan>{' '}
            <ExtraResourceSpan width="42%">
              <a
                href="https://www.youtube.com/channel/UC0K2OzIBLWfFvRNXX0ts3_A?utm_source=Application&utm_medium=Clicks&utm_campaign=Dashboard_Quick_Start_Overview"
                target="_blank"
                rel="noreferrer"
                data-cy="edu-talk-vid"
              >
                Edulastic Talk videos
              </a>
            </ExtraResourceSpan>
          </StyledExtraResourceContentDiv>
        </StyledExtraResourceDiv>
      </ModalBody>
    </EdulasticResourceModal>
  )
}

export default EdulasticOverviewModel

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const StyledDiv = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 0px 0px 15px 5px;
`

const StyledExtraResourceContentDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  margin-top: 8px;
`

const StyledExtraResourceDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 25px;
`

const StyledSpan = styled.span`
  font-weight: 600;
  color: ${greenDark};
  cursor: pointer;
`

const StyledDescSpan = styled.span`
  padding: 0px 0px 0px 10px;
`

const StyledButton = styled.div`
  cursor: pointer;
  display: inline-block;
  padding-top: 3px;
  min-width: 17px;
`

const ContentHeaderDiv = styled.div`
  padding: 10px 0px 20px 0px;
`

const ExtraResourceSpan = styled.span`
  padding: 5px 5px 0px 0px;
  color: ${greenDark};
  cursor: pointer;
  width: ${(props) => props.width || '29%'};
`
