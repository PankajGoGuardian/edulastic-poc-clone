import styled from "styled-components";
import { Layout, Spin, Button, Row } from "antd";

const { Content } = Layout;

// export const DistrictPolicyDiv = styled.div``;

export const StyledContent = styled(Content)`
  width: 95%;
  margin: 40px auto 0;
`;

export const StyledLayout = styled(Layout)`
  position: relative;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
  padding: 30px 60px;
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
  background: rgba(68, 68, 68, 0.1);
  z-index: 999;
  border-radius: 10px;
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`;

export const StyledSubjectContent = styled(Row)`
  margin-top: 20px;
`;

export const StyledSaveButton = styled(Button)`
  float: right;
`;

export const StyledSubjectTitle = styled.p`
  padding: 0 5px;
  font-weight: bold;
`;

export const StyledSubjectLine = styled.div`
  display: flex;
  padding: 5px 0px 5px 20px;
`;

export const StyledSubjectCloseButton = styled.a`
  margin-right: 20px;
  color: rgba(0, 0, 0, 0.25);
`;
