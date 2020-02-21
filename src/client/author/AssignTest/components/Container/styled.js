import {
  greyDarken,
  lightGreen1,
  linkColor,
  mediumDesktopWidth,
  mobileWidth,
  tabletWidth,
  themeColor,
  white
} from "@edulastic/colors";
import { Button, Card, FlexContainer } from "@edulastic/common";
import { Radio, Switch } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.div`
  padding: 20px 30px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;
`;

export const Main = styled.div`
  flex: 1;
  width: 100%;
`;

export const DRadio = styled(Radio)``;

export const AssignButton = styled(Button)`
  position: relative;
  min-width: 130px;
  height: 45px;
  color: ${themeColor};
  border-color: ${themeColor};
  border-radius: 3px;
  background: ${white};
  justify-content: space-around;
  margin-left: 20px;
  &:hover,
  &:focus {
    background: ${themeColor};
    color: ${white};
    border-color: ${themeColor};
  }
  [disabled] {
    pointer-events: none;
    cursor: not-allowed;
  }

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
    min-height: 36px;
    margin-left: 10px;
  }
`;

export const StyledCard = styled(Card)`
  border-radius: 5;
  overflow-x: auto;

  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`;

export const PaginationInfo = styled.span`
  font-weight: 600;
  display: inline-block;
  font-size: 11px;
  word-spacing: 5px;
  color: ${linkColor};
`;

export const AnchorLink = styled(Link)`
  text-transform: uppercase;
  color: ${linkColor};
`;

export const ActionDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  flex: 1;
  padding-right: 7px;
`;

export const Anchor = styled.a`
  text-transform: uppercase;
  color: ${linkColor};
  font-weight: bold;
`;

export const FullFlexContainer = styled(FlexContainer)`
  @media (max-width: 770px) {
    width: 100%;
  }
  justify-content: ${({ justifyContent }) => justifyContent || "flex-start"};
`;

export const StyledFlexContainer = styled(FlexContainer)`
  @media (max-width: ${tabletWidth}) {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  @media (max-width: ${mobileWidth}) {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  @media (max-width: 770px) {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 100%;
  }
`;

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const SwitchLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${greyDarken};
`;

export const ViewSwitch = styled(Switch)`
  width: 35px;
  margin: 0px 15px;
  background-color: ${lightGreen1};
`;

export const Paragraph = styled.p`
  margin-bottom: 15px;
  text-align: ${props => props.alignItems && props.alignItems};
`;
