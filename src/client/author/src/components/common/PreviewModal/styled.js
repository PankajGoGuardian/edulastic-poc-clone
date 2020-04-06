import styled from "styled-components";
import { FlexContainer, EduButton } from "@edulastic/common";
import {
  desktopWidth,
  white,
  themeColor,
  linkColor,
  red,
  mediumDesktopWidth,
  largeDesktopWidth,
  smallDesktopWidth
} from "@edulastic/colors";
import { Button, Icon, Typography, Input } from "antd";

const { Text } = Typography;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  overflow: auto;
  width: 100%;
  height: 100%;
  &.scratchpad-wrapper {
    input {
      position: absolute;
    }
  }
`;
export const WidgetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: ${({ alignItems = "" }) => alignItems || ""};
  > div {
    padding: 0;
  }
`;

export const MobileLeftSide = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 220px);
  left: 0;
  background: ${props => props.theme.testItemPreview.mobileLeftSideBgColor};
  width: 25px;
  bottom: 20px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;

export const MobileRightSide = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 220px);
  right: 0;
  background: ${props => props.theme.testItemPreview.mobileRightSideBgColor};
  width: 25px;
  bottom: 20px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

export const ButtonsContainer = styled(FlexContainer)`
  background: ${white};
  padding: 15px;
  justify-content: space-between;
  border-radius: 10px 10px 0px 0px;
  ${({ style }) => style};
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent};
  margin: 0;
  padding: ${props => props.padding || "0px"};
  ${({ style }) => style};
  .ant-btn {
    margin-bottom: ${props => props.mb || "0px"};
    &[title="Delete item"],
    &[title="Delete item"]:hover,
    &[title="Delete item"]:focus {
      border-color: red;
      background: white;
      color: red;
      svg {
        fill: red !important;
      }
    }
  }

  @media (max-width: ${largeDesktopWidth}) {
    flex-wrap: wrap;
  }
`;

export const ColumnContentArea = styled.div`
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 10px;
  height: ${props => (props.isAuthoring ? "auto" : "70vh")};
  display: ${props => (props.hideColumn ? "none" : "flex")};
  flex-direction: column;
  flex-basis: 100%;
  ${({ style }) => style};
`;

export const EvaluateButton = styled(Button)`
  font-size: 11px;
  height: 28px;
  color: ${themeColor};
  border-color: ${themeColor};
  margin-right: 5px;
  &:hover,
  &:focus {
    background: ${themeColor};
    color: ${white};
  }

  @media (max-width: ${desktopWidth}) {
    flex-basis: 100%;
    white-space: normal;
    height: auto;
    line-height: normal;
    padding: 5px 0px;
  }
`;

export const ReportIssueButton = styled(Button)`
  font-size: 16px;
  margin-left: 10px;
  width: max-content !important;
  height: 28px;
  padding: 0px 10px;
`;

export const PassageNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
  margin: 20px 0px 0px;
  padding: 0 5px;
  font-size: 11px;
  color: ${linkColor};
  .ant-pagination-item-active {
    a {
      color: ${white};
    }
    background-color: ${themeColor};
  }
  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
    border: 0;
    a {
      border: none;
    }
  }

  .ant-pagination {
    margin: 0 10px;
    &li {
      .ant-pagination-item a {
        color: ${linkColor};
      }
    }
  }
`;

export const Divider = styled.div`
  width: ${props => (props.isCollapsed ? "8%" : "25px")};
  position: relative;
  background-color: ${props => (props.isCollapsed ? "#e5e5e5" : "transparent")};
  border-radius: 10px;
  z-index: 1;
  > div {
    position: absolute;
    background: #fff;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    left: ${props =>
      props.collapseDirection === "left" ? "auto" : props.collapseDirection === "right" ? "-76px" : "-41px"};
    right: ${props =>
      props.collapseDirection === "right" ? "auto" : props.collapseDirection === "left" ? "-76px" : "-41px"};
  }
`;

export const CollapseBtn = styled.i`
  cursor: pointer;
  font-size: 15px;
  cursor: pointer;
  padding: 5px 15px;
  color: ${themeColor};
  ${props => {
    if (props.right) {
      return `border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color:${props.collapseDirection === "left" ? themeColor : "#fff"};
          color:${props.collapseDirection === "left" ? "#fff" : themeColor};
          svg{
            fill:${props.collapseDirection === "left" ? "#fff" : themeColor};
            &:hover{
              fill:${props.collapseDirection === "left" ? "#fff" : themeColor};
            }
          }`;
    }
    if (props.left) {
      return `border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        background-color:${props.collapseDirection === "right" ? themeColor : "#fff"};
        color:${props.collapseDirection === "right" ? "#fff" : themeColor};
        svg{
          fill:${props.collapseDirection === "right" ? "#fff" : themeColor};
          &:hover{
            fill:${props.collapseDirection === "right" ? "#fff" : themeColor};
          }
        }`;
    }
  }}
`;

export const IconArrow = styled(Icon)`
  color: ${props => props.theme.testItemPreview.iconArrowColor};
`;

export const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  span {
    font-size: 15px;
    font-weight: 600;
  }
  span > i {
    color: red;
    padding-right: 5px;
  }
`;

export const ReportIssueContainer = styled.div`
  textarea:hover,
  textarea:focus {
    border-color: red;
  }
`;

export const CloseButton = styled(Button)`
  border-radius: 50%;
  border: none;
  background: transparent;
`;

export const TextAreaSendButton = styled(Button)`
  float: right;
  margin-top: 10px;
  background: ${themeColor};
  color: ${white};
  &:hover,
  &:focus {
    color: ${themeColor};
  }
`;

export const StyledFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${({ style }) => style};
`;

export const StyledText = styled(Text)`
  display: block;
  color: ${({ danger }) => (danger ? red : themeColor)};
  font-size: 11px;
  font-weight: normal;
  padding-right: 15px;
  @media (max-width: ${mediumDesktopWidth}) {
    display: none;
  }
`;

export const RejectButton = styled(EduButton)`
  &.ant-btn.ant-btn-primary {
    svg {
      transition: none;
    }
    &:hover,
    &[disabled] {
      border-color: ${red} !important;
      background: #fff !important;
      span {
        color: ${red};
      }
      svg {
        fill: ${red} !important;
      }
    }
  }
`;

export const SyledSpan = styled.span`
  line-height: 0;
  padding: 0 11px;
`;

export const StyledInput = styled(Input.TextArea)`
  padding: 8px 22px;
  height: 40px;
`;
export const StyledRejectionSubmitBtn = styled(Button)`
  background: ${themeColor};
  height: 40px;
  width: 194px;
  text-transform: uppercase;
  margin-left: 10px;
  color: ${white};
  &:hover {
    background: green;
    font-weight: 500;
    color: ${white};
  }
`;

export const StyledFlexContainer = styled(FlexContainer)`
  .review-scratchpad {
    position: absolute;
    background: ${white};
    left: 50px;
    top: 138px;
    min-height: 380px;
    > div {
      min-height: 380px;
    }
    .ant-btn {
      margin-bottom: 8px;
      background: ${themeColor};
      width: 40px;
      height: 40px;
      &:hover {
        background: green;
      }
    }
    .ant-select {
      width: 40px;
      height: 40px;
      .ant-select-selection__rendered {
        line-height: 40px;
      }
    }
    #tool {
      margin-bottom: 4px;
      .rc-color-picker-wrap {
        width: 40px !important;
        height: 40px !important;
        .rc-color-picker-trigger {
          width: 40px !important;
          height: 40px !important;
          position: absolute;
        }
      }
    }
    .scratchpad-back-btn {
      background: ${themeColor};
      color: ${white};
      padding: 10px 0px;
      border-radius: 4px;
    }
    .scratchpad-fillcolor-container {
      background: ${themeColor};
      padding: 0 4px;
      border-radius: 4px;
    }
    .active-btn {
      background: green;
    }
    > div {
      justify-content: unset;
    }
    #tool div > div {
      color: unset;
      font-size: 13px;
    }
    @media (max-width: ${smallDesktopWidth}) {
      top: 170px;
      left: 45px;
      .ant-btn {
        margin-bottom: 4px;
        background: ${themeColor};
        width: 30px;
        height: 30px;
        &:hover {
          background: green;
        }
      }
      .ant-select {
        width: 30px;
        height: 30px;
        .ant-select-selection__rendered {
          line-height: 30px;
        }
      }
      #tool {
        margin-bottom: 4px;
        .rc-color-picker-wrap {
          width: 30px !important;
          height: 30px !important;
          .rc-color-picker-trigger {
            width: 30px !important;
            height: 30px !important;
          }
        }
      }
    }
  }
`;
