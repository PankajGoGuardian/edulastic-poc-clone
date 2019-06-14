import React from "react";
import { Divider, Row, Col, Icon } from "antd";
import { TextWrapper, LinkWrapper } from "../styledComponents";
import {
  SideContentWrapper,
  ColWrapper,
  ContentWrapper,
  Hdivider,
  VideoSection,
  VideoPlayer,
  VideoOverlay,
  ChatIconContainer,
  ChatIcon
} from "./styled";
import edulasticPublicBank from "../../assets/svgs/edulastic-public-bank.svg";
import edulasticCertified from "../../assets/svgs/edulastic-certified.svg";
import play from "../../assets/svgs/play.svg";
import videoImg from "../../assets/images/videoImage.png";

const Qbank = props => {
  const bg = props.bg;
  return (
    <Row>
      <Col span={13}>
        <TextWrapper size="12px" color="#7C848E">
          {props.title ? props.title : <img src={props.svg} alt="" />}
        </TextWrapper>
      </Col>
      <ColWrapper span={11} bg={bg}>
        <TextWrapper size="30px" color={props.color}>
          {props.num} K
        </TextWrapper>
        <TextWrapper size="11px" color={props.color}>
          QUESTIONS
        </TextWrapper>
      </ColWrapper>
    </Row>
  );
};

const QuestionBanks = () => {
  return (
    <>
      <Qbank title="PROGRESS BANK" num="40.8" color="#FFFFFF" bg="#FFA200" />
      <Hdivider />
      <Qbank svg={edulasticPublicBank} num="40.8" color="#FFFFFF" bg="#5EB500" />
      <Hdivider />
      <Qbank svg={edulasticCertified} num="134" color="#5EB500" bg="#F8F8F8" />
      <Hdivider />
    </>
  );
};

const SideContent = () => {
  return (
    <SideContentWrapper>
      <TextWrapper size="16px" color="#5EB500">
        Introduction to Edulastic
      </TextWrapper>
      <VideoSection>
        <VideoPlayer>
          <img src={videoImg} alt="" />
        </VideoPlayer>
        <VideoOverlay>
          <img src={play} alt="" />
        </VideoOverlay>

        <VideoOverlay />
      </VideoSection>
      <Row>
        <Col>
          <ContentWrapper mt="0.3rem" mb="1rem">
            <TextWrapper size="16px" color="#5EB500">
              Build assessments in minutes
            </TextWrapper>
            <TextWrapper size="14px" color="#848993">
              Search, review and assess using content from any of the following question banks:
            </TextWrapper>
          </ContentWrapper>
          <QuestionBanks />
          <ContentWrapper margin="1rem" textalign="center">
            <LinkWrapper color="#5EB500">VIEW ALL QUESTIONS</LinkWrapper>
          </ContentWrapper>

          <ChatIconContainer>
            <ChatIcon type="message" />
          </ChatIconContainer>
        </Col>
      </Row>
    </SideContentWrapper>
  );
};
export default SideContent;
