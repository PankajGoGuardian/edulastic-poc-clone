import { Radio, Switch } from "antd";
import styled from "styled-components";

import { mobileWidth, tabletWidth, fadedWhite, blue, white, fadedBlue } from "@edulastic/colors";
import { FlexContainer, Card, Button } from "@edulastic/common";

export const Container = styled.div`
  padding: 0 44px 20px 46px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;
  margin-top: 30px;

  .scrollbar-container {
    overflow: auto !important;
    height: calc(100vh - 150px);

    ::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: ${mobileWidth}) {
    padding: 0 26px 45px 26px;
  }
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
  border-radius: 5;
  overflow-x: auto;

  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: ${tabletWidth}) {
    display: none;
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
  background-color: #ffffff;
  &:after {
    background-color: #00ad50;
  }
`;

export const TestButton = styled(Button)`
  height: 45px;
  width: 130px;
  color: ${blue};
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
  position: absolute;
  left: -20px;
  top: 25px;
  z-index: 1;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  &:focus {
    outline: unset;
  }
`;

export const TableWrapper = styled.div`
  position: relative;
  width: 100%;
`;
