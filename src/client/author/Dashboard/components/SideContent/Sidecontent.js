import { themeColor, white } from "@edulastic/colors";
import { OnWhiteBgLogo, CustomModalStyled } from "@edulastic/common";
import { IconPlayFilled } from "@edulastic/icons";
import { Col, Icon, Row } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { isProxyUser as isProxyUserSelector } from "../../../../student/Login/ducks";
import videoImg from "../../assets/images/videoImage.png";
import { LinkWrapper, TextWrapper } from "../styledComponents";
import {
  ColWrapper,
  ContentWrapper,
  EduCertify,
  EduPublic,
  Hdivider,
  ScrollbarContainer,
  SideContentContainer,
  SideContentWrapper,
  SliderButton,
  VideoOverlay,
  VideoPlayer,
  VideoSection
} from "./styled";

const Qbank = props => {
  const { bg, title, svg, color, num, subtext } = props;

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
          {subtext || "QUESTIONS"}
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
    <Qbank title={EduPublicTitle} num="230" color="#5EB500" bg="#F8F8F8" />
    <Hdivider />
    <Qbank title={EduCertifyTitle} num="61.4" subtext="ITEMS" color="#FFFFFF" bg="#5EB500" />
    {/* <Hdivider />
    <Qbank title="PROGRESS BANK" num="40.8" color="#FFFFFF" bg="#FFA200" />
    <Hdivider /> */}
  </>
);

const SideContent = props => {
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
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
        <VideoSection onClick={() => setVideoModalVisible(true)}>
          <VideoPlayer>
            <img src={videoImg} alt="" />
          </VideoPlayer>
          <VideoOverlay>
            <IconPlayFilled color={white} height="20" width="20" />
          </VideoOverlay>
          <VideoOverlay />
        </VideoSection>
        <CustomModalStyled
          title="Introduction to Edulastic"
          visible={isVideoModalVisible}
          onCancel={() => setVideoModalVisible(false)}
          footer={null}
          destroyOnClose
          width="768px"
          centered
        >
          <iframe
            title="Welcome to Edulastic 2020"
            src="//fast.wistia.net/embed/iframe/6in8kpqe03"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            width="100%"
            height="400"
          />
        </CustomModalStyled>
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
                <LinkWrapper color={themeColor}>
                  <Link to="/author/items">VIEW ALL QUESTIONS</Link>
                </LinkWrapper>
              </ContentWrapper>
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
