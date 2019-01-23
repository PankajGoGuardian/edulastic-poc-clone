import React from "react";
import styled from "styled-components";
import { Layout } from "antd";

// components
import ManageHeader from "../../component/Header";
import ManageContainer from "./Container";

const Wrapper = styled(Layout)`
  width: 100%;
`;

const ManageClass = () => (
  <Wrapper>
    <ManageHeader titleText="common.manageClassTitle" classSelect={false} />
    <ManageContainer />
  </Wrapper>
);

export default ManageClass;
