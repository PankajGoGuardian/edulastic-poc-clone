import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { themeColor, linkColor } from "@edulastic/colors";
import { Button, Icon } from "antd";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow-y: auto;
  overflow-x: hidden;
`;
export const WidgetContainer = styled.div`
  display: ${({ flowLayout }) => (flowLayout ? "flex" : "block")};
  flex-wrap: wrap;
  align-items: center;
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
  background: #fff;
  padding: 15px 15px 0px 35px;
  justify-content: space-between;
  flex-basis: 400px;
  border-radius: 10px 10px 0px 0px;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent};
  margin-top: 20px;
  .ant-btn {
    width: 120px;
    margin: 0 5px;
  }
`;

export const ColumnContentArea = styled.div`
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  width: ${props => props.width};
  background: #fff;
  border-radius: 10px;
  height: ${props => (props.isAuthoring ? "auto" : "70vh")};
  display: ${props => (props.hideColumn ? "none" : "initial")};
`;

export const EvaluateButton = styled(Button)`
  font-size: 11px;
  height: 28px;
  color: ${themeColor};
  border-color: ${themeColor};
`;

export const PassageNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 0 10px;
  font-size: 11px;
  color: ${linkColor};
  .ant-pagination-item-active {
    a {
      color: #fff;
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
        background-color:${props.collapseDirection === "right" ? themeColor : "#fff"}
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
