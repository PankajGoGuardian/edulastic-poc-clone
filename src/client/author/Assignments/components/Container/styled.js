import { Radio, Switch } from "antd";
import styled from "styled-components";

import { mobileWidth, tabletWidth, white, themeColor, desktopWidth, smallDesktopWidth } from "@edulastic/colors";
import { FlexContainer, Card, Button } from "@edulastic/common";

export const Container = styled.div`
  padding: 30px 30px 15px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;

  .scrollbar-container {
    height: calc(100vh - 120px);
    width: 100%;
    padding-right: 30px;
    padding-left: 2px;
  }

  @media (max-width: ${tabletWidth}) {
    .scrollbar-container {
      height: calc(100vh - 90px);
    }
  }
  @media (max-width: ${mobileWidth}) {
    padding: 0 26px 45px 26px;
  }
`;

export const LeftWrapper = styled.div`
  min-width: 230px;
  max-width: 230px;
  margin-top: 10px;

  @media (max-width: ${desktopWidth}) {
    position: fixed;
    top: 50px;
    left: 100px;
    background: white;
    padding: 15px;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.07);
    height: calc(100vh - 50px);
    z-index: 1;
  }

  @media (max-width: ${tabletWidth}) {
    left: 0px;
  }
`;

export const FixedWrapper = styled.div`
  width: 230px;
  position: fixed;
`;

export const PaginationInfo = styled.span`
  font-weight: 600;
  font-size: 13px;
  display: inline-block;
  @media (max-width: ${tabletWidth}) {
    display: none;
  }
  @media (max-width: 770px) {
    display: none;
  }
`;

export const Main = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  position: relative;
`;

export const DRadio = styled(Radio)``;

export const StyledCard = styled(Card)`
  overflow-x: auto;

  .ant-card-body {
    padding: 20px 0px 60px;
    min-height: calc(100vh - 110px);
  }
`;

export const FullFlexContainer = styled(FlexContainer)`
  @media (max-width: 770px) {
    width: 100%;
  }
  justify-content: flex-end;
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

export const ViewSwitch = styled(Switch)`
  width: 35px;
  margin: 0px 15px;
  background-color: ${white};
  &.ant-switch-checked {
    background-color: ${white};
  }
  &:after {
    background-color: ${themeColor};
  }
`;

export const TestButton = styled(Button)`
  height: 45px;
  width: 130px;
  color: ${themeColor};
  border-radius: 3px;
  margin-left: 25px;
  background: ${white};
`;

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const SwitchLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${white};
`;

export const FilterButton = styled(Button)`
  min-width: 35px;
  min-height: 25px;
  padding: 2px;
  padding-top: 5px;
  border-radius: 3px;
  position: fixed;
  margin-left: -20px;
  margin-top: 34px;
  z-index: 1;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  background: ${props => (props.showFilter ? themeColor : white)} !important;
  &:focus,
  &:hover {
    outline: unset;
    color: ${props => (props.isShowFilter ? white : themeColor)};
  }

  @media (max-width: ${desktopWidth}) {
    margin-left: ${props => (props.showFilter ? "180px" : "-20px")};
    margin-top: ${props => (props.showFilter ? "-25px" : "34px")};
  }
`;

export const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  @media (max-width: ${smallDesktopWidth}) and (min-width: ${desktopWidth}) {
    width: ${props => props.showFilter && "75%"};
  }
`;
