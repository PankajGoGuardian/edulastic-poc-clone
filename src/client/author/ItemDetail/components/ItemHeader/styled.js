import { largeDesktopWidth, desktopWidth, mediumDesktopWidth, themeColor, mobileWidth, white } from "@edulastic/colors";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FlexContainer } from "@edulastic/common";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";

export const Container = styled.div`
  padding-top: 96px;
  .fixed-header {
    display: flex;
    align-items: center;
    background: ${props => props.theme.header.headerBgColor};
    height: 96px;
    padding: 0px 30px;
    & > div {
      width: 100%;
    }
  }

  @media (max-width: ${mediumDesktopWidth}) {
    padding-top: 60px;
    .fixed-header {
      height: 60px;
    }
  }
  @media (max-width: ${desktopWidth}) {
    padding-top: 110px;
    .fixed-header {
      height: auto;
      padding: 10px 20px;
    }
  }
`;

export const ExtraFlex = styled(FlexContainer)`
  @media (max-width: ${desktopWidth}) {
    flex-direction: column;
    align-items: flex-start;
    max-width: 100%;
  }
`;

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

export const Title = styled.div`
  font-size: 22px;
  white-space: nowrap;
  font-weight: 700;
  line-height: 1.36;
  color: ${white};
  text-overflow: ellipsis;
  overflow: hidden;

  @media (max-width: ${largeDesktopWidth}) {
    max-width: 250px;
  }
  @media (max-width: ${desktopWidth}) {
    max-width: 100%;
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
