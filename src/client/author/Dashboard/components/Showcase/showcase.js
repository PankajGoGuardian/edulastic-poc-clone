import React from "react";
import { Row, Col, Layout, Rate, Icon, Button } from "antd";
import styled from "styled-components";
import SideContent from "../SideContent/Sidecontent";
import MyClasses from "./components/Myclasses/Myclass";
import ShowcaseImage from "./components/ShowcaseImage/Showcaseimage";
import { GreencardSection, InfoSection } from "./components/Cards/Cards";

const { Content } = Layout;

const MainContent = () => (
  <MainContainer>
    <Row gutter={10}>
      <Col span={17}>
        <ShowcaseImage />
      </Col>
      <Col span={7}>
        <GreencardSection />
        <InfoSection />
      </Col>
    </Row>
    <Row>
      <MyClasses />
    </Row>
  </MainContainer>
);

const MainContainer = styled.div`
  background: #f3f3f8;
  width: calc(100vw - 356px);
  padding: 1rem;
`;
export default MainContent;
