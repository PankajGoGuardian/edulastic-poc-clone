import styled from "styled-components";
import { Layout, Spin, Row, Button, Radio } from "antd";
import { mediumDesktopExactWidth } from "@edulastic/colors";

const { Content } = Layout;

export const TestSettingDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledContent = styled(Content)`
  width: 100%;
  padding: 90px 30px 30px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 126px 30px 30px;
  }
`;

export const StyledLayout = styled(Layout)`
  position: relative;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
  padding: 30px;
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

export const StyledRow = styled(Row)`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  min-height: 32px;
  align-items: center;
`;

export const StyledLabel = styled.label`
  text-align: left;
  width: 240px;
`;

export const Break = styled.div`
  height: 0;
  flex-basis: 100%;
`;

export const SaveButton = styled(Button)`
  margin-left: auto;
`;

export const StyledRdioGroup = styled(Radio.Group)``;
