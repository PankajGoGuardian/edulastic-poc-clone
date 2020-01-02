import styled from "styled-components";
import { Button } from "antd";

import { themeColor, white, mediumDesktopExactWidth, extraDesktopWidthMax, smallDesktopWidth } from "@edulastic/colors";

export const QuestionsWrapper = styled.div`
  position: relative;
  width: 350px;
  padding: ${props =>
    props.reportMode ? "0px 15px 15px" : props.review && !props.testMode ? "30px 15px 50px" : "30px 15px"};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  height: ${props => props.viewMode && `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};

  @media (max-width: ${smallDesktopWidth}) {
    width: 280px;
  }
  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => props.viewMode && `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => props.viewMode && `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
`;

export const QuestionWidgetWrapper = styled.div`
  max-height: ${props =>
    `calc(100vh - ${
      props.testMode
        ? "130"
        : props.reportMode
        ? props.theme.HeaderHeight.xs + 60
        : props.theme.HeaderHeight.xs + (props.review ? 90 : 185)
    }px)`};
  overflow: auto;

  @media (min-width: ${mediumDesktopExactWidth}) {
    max-height: ${props =>
      `calc(100vh - ${
        props.testMode
          ? "130"
          : props.reportMode
          ? props.theme.HeaderHeight.md + 60
          : props.theme.HeaderHeight.md + (props.review ? 90 : 185)
      }px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    max-height: ${props =>
      `calc(100vh - ${
        props.testMode
          ? "130"
          : props.reportMode
          ? props.theme.HeaderHeight.xl + 60
          : props.theme.HeaderHeight.xl + (props.review ? 90 : 185)
      }px)`};
  }
`;

export const AnswerActionsWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: flex-end;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background: #fbfafc;
`;

export const AnswerAction = styled(Button)`
  width: 136px;
  height: 32px;
  background: ${({ active }) => (active ? themeColor : "transparent")};
  border: 1px solid ${themeColor};
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ active }) => (active ? white : themeColor)};
  text-transform: uppercase;
  margin-right: 15px;

  &:hover,
  &:active,
  &:focus {
    background: ${({ active }) => (active ? themeColor : "transparent")};
    color: ${({ active }) => (active ? white : themeColor)};
  }
  &:last-child {
    margin-right: 0;
  }
`;

export const StyledHandleSpan = styled.span`
  color: #00ad50;
  display: flex;
  align-items: center;
  border: 1px solid #e6e6e6;
  border-radius: 10px 0 0 10px;
  background: #fff;
  width: 30px;
  padding-left: 6px;
  cursor: grab;
`;
