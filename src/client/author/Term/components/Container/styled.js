import styled from "styled-components";
import { Layout, Spin } from "antd";

const { Content } = Layout;

export const TermDiv = styled.div`
  background-color: #fff;
`;

export const StyledContent = styled(Content)`
  width: 100%;
  padding-left: 40px;
  padding-right: 40px;
  margin: 20px auto 0;
`;

export const StyledLayout = styled(Layout)`
  position: relative;
  background: #fff;
  display: flex;
  flex-direction: column;
  pointer-events: ${props => (props.loading === "true" ? "none" : "auto")}
  min-height: 400px;
`;

export const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`;
