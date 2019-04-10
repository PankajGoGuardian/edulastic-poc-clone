import styled from "styled-components";
import { Layout, Spin, Row, Button, Radio } from "antd";

const { Content } = Layout;

export const TestSettingDiv = styled.div``;

export const StyledContent = styled(Content)`
  width: 95%;
  margin: 40px auto 0;
`;

export const StyledLayout = styled(Layout)`
  position: relative;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
  padding: 30px 40px;
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

export const SaveButton = styled(Button)`
  color: white;
  border: 1px solid #00b0ff;
  min-width: 85px;
  background: #00b0ff;
  margin-left: auto;
  &:hover {
    background: #fff;
    border-color: #40a9ff;
  }
`;

export const StyledRdioGroup = styled(Radio.Group)``;
