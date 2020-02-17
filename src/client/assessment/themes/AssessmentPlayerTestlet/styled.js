import styled from "styled-components";
import { Button } from "antd";
import { boxShadowDefault } from "@edulastic/colors";
import { Header } from "../common";
import { IPAD_PORTRAIT_WIDTH } from "../../constants/others";

export const Main = styled.main`
  background-color: ${props => props.theme.mainBgColor};
  padding: 96px 0px 32px;
  display: flex;
  flex-direction: row;
  min-height: ${({ LCBPreviewModal }) => (LCBPreviewModal ? "calc(100vh - 56px)" : "100vh")};
  box-sizing: border-box;
  margin: 0px 32px;
`;

export const MainContent = styled.div`
  background-color: ${props => props.theme.mainContentBgColor};
  color: ${props => props.theme.mainContentTextColor};
  border-radius: 10px;
  flex: 1;
  text-align: left;
  font-size: 18px;
  overflow: auto;
  position: relative;

  & * {
    -webkit-touch-callout: none;
    user-select: none;
  }

  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    padding: 24px;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    overflow: auto;
    height: 100%;
    width: 100%;
    border-style: none;
    border-width: 0px;
  }
`;

export const PlayerTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #fff;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
export const ActionButton = styled(Button)`
  border-radius: 5px;
  height: 40px;
  margin-left: 10px;
  color: #00ad50;
  font-weight: 900;
  font-size: 17px;
  user-select: none;

  span {
    margin: 0px 8px;
  }

  svg {
    fill: #00ad50;
  }
  &.ant-btn[disabled] {
    svg {
      fill: #d9d9d8;
    }
  }
`;

export const FlexDisplay = styled.div`
  display: flex;
`;

export const ContainerRight = styled.div`
  display: flex;
  margin-left: 40px;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    margin-left: auto;
  }
`;

export const HeaderPracticePlayer = styled(Header)`
  background: ${props => props.theme.header.headerBg};
  box-shadow: ${boxShadowDefault};
  height: 70px;
  z-index: 1000;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    height: 104px;
  }
`;

export const OverlayDiv = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 9999;
  background: transparent;
`;
