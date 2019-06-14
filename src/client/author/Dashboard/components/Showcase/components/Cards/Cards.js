import React from "react";
import { Row, Col } from "antd";
import {
  GreenCardContainer,
  Greencard,
  GreenCardBottomLayer,
  Infocard,
  InfoCardIconWrapper,
  RateWrapper,
  ButtonWrapper
} from "./styled";
import { TextWrapper } from "../../../styledComponents";
import eurekaMath from "../../../../assets/svgs/eureka-math.svg";
import heart from "../../../../assets/svgs/heart.svg";
import share from "../../../../assets/svgs/share-button.svg";
import user from "../../../../assets/svgs/man-user.svg";
import hash from "../../../../assets/svgs/hash.svg";
// greenCard box
export const GreencardSection = () => (
  <Greencard>
    <img src={eurekaMath} alt="" />
    <TextWrapper color="#FFFFFF" size="12px">
      Course 3 Middle School Math Solution
    </TextWrapper>
    <RateWrapper defaultValue={0} />
  </Greencard>
);
// info card
export const InfoSection = () => (
  <Infocard>
    <TextWrapper size="16px" color="#00AD50">
      Course 3 Middle School Math
    </TextWrapper>
    <TextWrapper size="12px" color="#434B5D" padding="0.5rem">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fermentum metus et luctus lacinia.
    </TextWrapper>
    <ButtonWrapper block>TRY NOW</ButtonWrapper>
    <InfoCardIconWrapper>
      <Col>
        <Row>
          <Col span={10}>
            <img src={user} alt="" />
          </Col>
          <Col span={10}>
            <TextWrapper size="10px">Kevin Hart</TextWrapper>
          </Col>
        </Row>
      </Col>
      <Col>
        <Row>
          <Col span={10}>
            <img src={hash} alt="" />
          </Col>
          <Col span={10}>
            <TextWrapper size="10px">1200</TextWrapper>
          </Col>
        </Row>
      </Col>
      <Col>
        <Row>
          <Col span={10}>
            <img src={share} alt="" />
          </Col>
          <Col span={10}>
            <TextWrapper size="10px">11,098</TextWrapper>
          </Col>
        </Row>
      </Col>
      <Col>
        <Row gutter={10}>
          <Col span={12}>
            <img src={heart} alt="" />
          </Col>
          <Col span={12}>
            <TextWrapper size="10px">9</TextWrapper>
          </Col>
        </Row>
      </Col>
    </InfoCardIconWrapper>
  </Infocard>
);
