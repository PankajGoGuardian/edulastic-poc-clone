import styled from "styled-components";
import { Layout, Spin } from "antd";
import { mediumDesktopWidth } from "@edulastic/colors";

const { Content } = Layout;

export const StudentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledContent = styled(Content)`
  width: 100%;
  padding: 126px 30px 30px;

  @media (max-width: ${mediumDesktopWidth}) {
    padding: 90px 30px 30px;
  }
`;

export const StyledLayout = styled(Layout)`
  position: relative;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius:10px;
  padding: 30px;
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
