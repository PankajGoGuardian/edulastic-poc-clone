import styled from "styled-components";
import { themeColor } from "@edulastic/colors";
import { SMALL_DESKTOP_WIDTH } from "../../../constants/others";

export const Container = styled.div`
  display: ${props => (props.width > SMALL_DESKTOP_WIDTH ? "flex" : "block")};
  position: relative;
  justify-content: ${props => (props.isCollapsed ? "space-between" : "initial")};
  overflow: auto;
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
