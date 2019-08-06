import styled from "styled-components";
import { themeColor } from "@edulastic/colors";
import { SMALL_DESKTOP_WIDTH } from "../../../constants/others";

export const Container = styled.div`
  display: ${props => (props.width > SMALL_DESKTOP_WIDTH ? "flex" : "block")};
  position: relative;
`;

export const Divider = styled.div`
  width: 2px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
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
  &.fa-arrow-left {
    right: 1px;
  }
  &.fa-arrow-right {
    left: 1px;
  }
`;
