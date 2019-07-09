import { Radio, Switch } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { mobileWidth, tabletWidth, linkColor, greyDarken, lightGreen1, themeColor, white } from "@edulastic/colors";
import { FlexContainer, Card, Button } from "@edulastic/common";

export const Container = styled.div`
  padding: 0 44px 20px 46px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;
  margin-top: 20px;
  @media (max-width: ${mobileWidth}) {
    padding: 0 26px 45px 26px;
  }
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
