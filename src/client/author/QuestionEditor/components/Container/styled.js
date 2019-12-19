import styled from "styled-components";
import { themeColor, smallMobileWidth, white, lightGreen } from "@edulastic/colors";
import { Button } from "antd";

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

  @media (max-width: ${smallMobileWidth}) {
    padding: 0 10px;
  }
`;

export const StyledButton = styled.div`
  background: ${themeColor};
  color: ${white};
  padding: 6px 11px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  display: inline-block;
  float: right;
`;
