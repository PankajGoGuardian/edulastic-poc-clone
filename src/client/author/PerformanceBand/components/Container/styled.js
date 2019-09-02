import styled from "styled-components";
import { Layout, Spin } from "antd";
import { themeColor, white } from "@edulastic/colors";
import { ThemeButton } from "../../../src/components/common/ThemeButton";

const { Content } = Layout;

export const PerformanceBandDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledContent = styled(Content)`
  width: 95%;
  margin: 150px 30px 10px 30px;
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

export const CreateProfile = styled(ThemeButton)`
  font-size: 11px;
  text-transform: uppercase;
  height: 45px;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  i {
    width: 19px;
    height: 19px;
    background: ${white};
    color: ${themeColor};
    line-height: 20px;
    border-radius: 50%;
    margin-right: 10px;
    font-style: normal;
    font-size: 20px;
    text-align: center;
  }
`;
