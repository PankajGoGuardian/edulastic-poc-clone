import React, { useState } from "react";
import { Row, Col, Icon } from "antd";
import { IconPlayFilled } from "@edulastic/icons";
import { white, themeColor } from "@edulastic/colors";
import { OnWhiteBgLogo } from "@edulastic/common";
import { connect } from "react-redux";
import { isProxyUser as isProxyUserSelector } from "../../../../student/Login/ducks";
import { TextWrapper, LinkWrapper } from "../styledComponents";
import {
  SideContentContainer,
  SliderButton,
  ScrollbarContainer,
  SideContentWrapper,
  ColWrapper,
  ContentWrapper,
  Hdivider,
  VideoSection,
  VideoPlayer,
  VideoOverlay,
  ChatIconContainer,
  ChatIcon,
  EduCertify,
  EduPublic
} from "./styled";
import videoImg from "../../assets/images/videoImage.png";

const Qbank = props => {
  const { bg, title, svg, color, num } = props;

  return (
    <Row type="flex" align="middle">
      <Col span={13}>
        <TextWrapper size="12px" rfs="12px" fw="bold" color="#7C848E">
          {title || <img src={svg} alt="" />}
        </TextWrapper>
      </Col>
      <ColWrapper span={11} bg={bg}>
        <TextWrapper size="30px" rfs="24px" fw="bold" lh="24px" color={color}>
          {num} K
        </TextWrapper>
        <TextWrapper size="11px" rfs="11px" fw="bold" color={color}>
          QUESTIONS
        </TextWrapper>
      </ColWrapper>
    </Row>
  );
};

const EduPublicTitle = (
  <EduPublic>
    <OnWhiteBgLogo height={35} style={{ paddingBottom: "10px" }} />
    <span>PUBLIC BANK</span>
  </EduPublic>
);

const EduCertifyTitle = (
  <EduCertify>
    <OnWhiteBgLogo height={35} style={{ paddingBottom: "10px" }} />
    <span>CERTIFIED</span>
  </EduCertify>
);

const QuestionBanks = () => (
  <>
    <Qbank title="PROGRESS BANK" num="40.8" color="#FFFFFF" bg="#FFA200" />
    <Hdivider />
    <Qbank title={EduCertifyTitle} num="40.8" color="#FFFFFF" bg="#5EB500" />
    <Hdivider />
    <Qbank title={EduPublicTitle} num="134" color="#5EB500" bg="#F8F8F8" />
    <Hdivider />
  </>
);

const SideContent = props => {
  const [showSideContent, toggleSideContent] = useState(false);
  const { isProxyUser } = props;
  return (
    <SideContentContainer show={showSideContent} isProxyUser={isProxyUser}>
      <SliderButton
        onClick={() => {
          toggleSideContent(!showSideContent);
        }}
      >
        <Icon type={showSideContent ? "right" : "left"} />
      </SliderButton>
      <SideContentWrapper>
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
        <Row>
          <Col>
            <ContentWrapper mt="0.3rem" mb="1rem">
              <TextWrapper fw="600" color="#5EB500">
                Build assessments in minutes
              </TextWrapper>
              <TextWrapper size="14px" rfs="13px" color="#848993">
                Search, review and assess using content from any of the following question banks:
              </TextWrapper>
            </ContentWrapper>
            <ScrollbarContainer>
              <QuestionBanks />
            </ScrollbarContainer>
            <div>
              <ContentWrapper margin="1rem" textalign="center">
                <LinkWrapper color={themeColor}>VIEW ALL QUESTIONS</LinkWrapper>
              </ContentWrapper>

              <ChatIconContainer>
                <ChatIcon type="message" />
              </ChatIconContainer>
            </div>
          </Col>
        </Row>
      </SideContentWrapper>
    </SideContentContainer>
  );
};
export default connect(state => ({
  isProxyUser: isProxyUserSelector(state)
}))(SideContent);
