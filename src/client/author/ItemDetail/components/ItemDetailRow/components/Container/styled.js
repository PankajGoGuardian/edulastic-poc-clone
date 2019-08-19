import { FlexContainer, Paper } from "@edulastic/common";
import { darkBlueSecondary, mobileWidth, themeColor } from "@edulastic/colors";
import styled from "styled-components";

export const Content = styled(Paper)`
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  padding: ${props => (props.padding ? props.padding : "0px")};
  overflow: hidden;
  position: relative;
  @media (max-width: ${mobileWidth}) {
    padding: 33px 30px;
  }
`;

export const TabContainer = styled.div`
  margin-bottom: 30px;
`;

export const AddButtonContainer = styled(FlexContainer)`
  margin-bottom: 0;
  margin-top: 25px;
`;

export const AddPassageBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  button {
    margin-right: 10px;
    background-color: ${themeColor};
    color: #fff;
    height: 45px;
    width: 170px;
    font-size: 11px;
    &:hover {
      color: ${themeColor};
    }
    &:last-child {
      background-color: #fff;
      color: ${themeColor};
    }
    &:focus > span:first-child,
    &:active > span:first-child {
      position: absolute;
    }
  }
`;

export const MobileSide = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 220px);
  right: ${props => (props.type === "right" ? "0" : "unset")};
  left: ${props => (props.type === "left" ? "0" : "unset")};
  background: ${darkBlueSecondary};
  width: 25px;
  bottom: 20px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

export const WidgetContainer = styled.div`
  display: ${({ flowLayout }) => (flowLayout ? "flex" : "block")};
  flex-wrap: wrap;
  align-items: center;
`;

export const CollapseBtn = styled.i`
  position: absolute;
  top: 0;
  cursor: pointer;
  font-size: 15px;
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 5px;
  border: 1px solid ${themeColor};
  color: ${themeColor};
  margin: 10px;
  z-index: 1;
  &.fa-arrow-left {
    right: 1px;
  }
  &.fa-arrow-right {
    left: 1px;
  }
`;

export const PlusIcon = styled.span`
  position: absolute;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid ${themeColor};
  color: ${themeColor};
  left: 10px;
  top: 12px;
  font-size: 18px;
  line-height: 1;
`;
