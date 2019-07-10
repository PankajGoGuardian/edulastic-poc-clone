import React from "react";
import { Row, Col, Layout, Rate, Icon, Button } from "antd";
import styled from "styled-components";
import MyClasses from "./components/Myclasses/Myclass";

const { Content } = Layout;

const MainContent = () => (
  <MainContainer>
    <MyClasses />
  </MainContainer>
);

const MainContainer = styled.div`
  background: #f3f3f8;
  padding: 1rem;
  display: flex;
`;
export default MainContent;
