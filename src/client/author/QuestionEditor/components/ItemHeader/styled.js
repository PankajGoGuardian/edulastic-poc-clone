import { themeColor, white, desktopWidth } from "@edulastic/colors";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const LeftSide = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: ${desktopWidth}) {
    width: 100%;
    padding: 0;
    margin: 0;
  }
`;

export const RightSide = styled.div`
  text-align: right;
  position: relative;
  flex: 1;
  align-self: flex-end;

  @media (max-width: ${desktopWidth}) {
    position: static;
    width: 100%;
    height: auto;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0px;
    display: flex;
    margin-top: 20px;
    flex: auto;
  }
`;

export const Back = styled(Link)`
  color: ${white};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;

  :hover {
    color: ${themeColor};
  }
`;

export const TitleNav = styled.div`
  display: flex;
  width: auto;
  min-width: 200px;

  @media (max-width: ${desktopWidth}) {
    min-width: 0;
    max-width: calc(100vw - 150px);
  }
`;
