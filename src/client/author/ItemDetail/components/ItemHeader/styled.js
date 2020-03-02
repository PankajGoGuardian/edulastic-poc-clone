import { desktopWidth, mobileWidth, themeColor, white } from "@edulastic/colors";
import { Link } from "react-router-dom";
import styled from "styled-components";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";

export const MobileContainer = styled(HeaderWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${mobileWidth}) {
  }
`;

export const RightSide = styled.div`
  text-align: right;
  position: relative;
  flex: 1;

  @media (max-width: ${desktopWidth}) {
    position: static;
    width: 100%;
    height: auto;
    margin-top: auto;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0px;
    display: flex;
    margin-top: 20px;
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

export const ReferenceText = styled.div`
  margin-left: 94.5px;
  color: ${white};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
`;

export const ReferenceValue = styled.div`
  margin-left: 11px;
  font-size: 13px;
  font-style: italic;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${white};
`;
