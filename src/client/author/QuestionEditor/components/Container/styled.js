import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import { themeColor } from "@edulastic/colors";

export const BackLink = styled.span`
  background: #fff;
  border-radius: 3px;
  height: 28px;
  font-size: 11px;
  font-weight: 600;
  line-height: 28px;
  padding: 0 20px;
  color: ${themeColor};
  text-transform: uppercase;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  cursor: pointer;
  display: inline-block;
`;

export const ScrollbarContainer = styled(PerfectScrollbar)`
  padding-top: 10px;
  padding-left: 10px;
  height: calc(100vh - 150px);
`;
