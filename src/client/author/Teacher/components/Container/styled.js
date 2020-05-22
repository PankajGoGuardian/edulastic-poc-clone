import styled from "styled-components";
import { Layout, Spin } from "antd";

const { Content } = Layout;

export const TeacherDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledContent = styled(Content)`
  width: 80%;
  padding-left: 20px;
  padding-right: 20px;
  margin: 80px 20px 20px 20px;
`;

export const StyledLayout = styled(Layout)`
  position: relative;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  pointer-events: ${props => (props.loading === "true" ? "none" : "auto")};
  min-height: 400px;
  background: transparent;
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
