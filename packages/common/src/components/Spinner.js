import React from "react";
import styled from "styled-components";
import { Spin } from "antd";

const SpinLoader = ({ position, height }) => (
  <SpinWrapper position={position} height={height}>
    <Spin />
  </SpinWrapper>
);

export default SpinLoader;

const SpinWrapper = styled.div`
  position: ${props => props.position || "absolute"};
  height: ${props => props.height || "100%"};
  left: 0;
  right: 0;
  top: 0;
  bottom: 0px;
  z-index: 9999;

  .ant-spin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
  }
`;
