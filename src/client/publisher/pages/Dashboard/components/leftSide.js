import React from "react";
import styled from "styled-components";

import { white, themeColor, mediumDesktopExactWidth, extraDesktopWidthMax } from "@edulastic/colors";
import { IconPlayFilled } from "@edulastic/icons";
import { TextWrapper, LinkWrapper } from "../../../../author/Dashboard/components/styledComponents";
import {
  VideoSection,
  VideoPlayer,
  VideoOverlay,
  ContentWrapper,
  ChatIconContainer,
  ChatIcon
} from "../../../../author/Dashboard/components/SideContent/styled";
import videoImg from "../../../../author/Dashboard/assets/images/videoImage.png";
import { StyledQuestionsList } from "./questionsList";

const LeftSide = props => {
  const { className } = props;
  return (
    <div className={className}>
      <div className="introduction-edulastic">
        <TextWrapper fw="600" mb="5px" color="#5EB500">
          Introduction to Edulastic
        </TextWrapper>
        <VideoSection>
          <VideoPlayer>
            <img src={videoImg} alt="" />
          </VideoPlayer>
          <VideoOverlay>
            <IconPlayFilled color={white} height="20" width="20" />
          </VideoOverlay>
          <VideoOverlay />
        </VideoSection>
      </div>
      <div className="build-assessments">
        <ContentWrapper mt="0.3rem" mb="1rem">
          <TextWrapper fw="600" color="#5EB500">
            Build assessments in minutes
          </TextWrapper>
          <TextWrapper size="14px" rfs="13px" color="#848993">
            Search, review and assess using content from any of the following question banks:
          </TextWrapper>
        </ContentWrapper>
      </div>
      <div className="questions">
        <div className="questions-list">
          <StyledQuestionsList />
        </div>
        <div className="view-questions">
          <ContentWrapper margin="1rem" textalign="center">
            <LinkWrapper color={themeColor}>VIEW ALL QUESTIONS</LinkWrapper>
          </ContentWrapper>
          <ChatIconContainer>
            <ChatIcon type="message" />
          </ChatIconContainer>
        </div>
      </div>
    </div>
  );
};

export const StyledLeftSide = styled(LeftSide)`
  width: 358px;
  padding: 20px 30px;
  background-color: ${white};
  position: fixed;

  height: calc(100% - ${props => props.theme.HeaderHeight.xs}px);
  @media (min-width: ${mediumDesktopExactWidth}) {
    height: calc(100% - ${props => props.theme.HeaderHeight.md}px);
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: calc(100% - ${props => props.theme.HeaderHeight.xl}px);
  }
`;
