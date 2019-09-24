import styled from "styled-components";
import { boxShadowDefault } from "@edulastic/colors";
import { Header } from "../common";
import { IPAD_PORTRAIT_WIDTH } from "../../constants/others";

export const Main = styled.main`
  background-color: ${props => props.theme.mainBgColor};
  padding: 96px 0px 32px;
  display: flex;
  flex-direction: row;
  min-height: 100vh;
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
    border-color: #888888;
    border-style: dashed;
    border-width: thin;
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
export const ActionButton = styled.div`
  border-radius: 5px;
  padding: 12px 14px;
  margin-left: 10px;
  color: ${props => props.theme.headerIconColor};
  font-weight: 900;
  font-size: 17px;

  ${props => {
    const { theme, disable } = props;
    return `
      background: ${disable ? theme.btnDisabled : theme.headerIconBgColor};
      ${
        disable
          ? ` cursor: not-allowed;
              pointer-events: none;
          `
          : `cursor: pointer;`
      }
    `;
  }}

  span {
    margin: 0px 8px;
  }

  svg {
    fill: ${props => props.theme.headerIconColor};
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
  background: ${props => props.theme.headerBg};
  box-shadow: ${boxShadowDefault};
  height: 70px;
  z-index: 1;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    height: 104px;
  }
`;
