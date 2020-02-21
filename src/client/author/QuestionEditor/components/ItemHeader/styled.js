import {
  largeDesktopWidth,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  themeColor,
  white,
  desktopWidth
} from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  padding-top: ${props => props.theme.HeaderHeight.xs}px;
  .fixed-header {
    display: flex;
    align-items: center;
    background: ${props => props.theme.header.headerBgColor};
    height: ${props => props.theme.HeaderHeight.xs}px;
    padding: 0px 30px;
    & > div {
      width: 100%;
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding-top: ${props => props.theme.HeaderHeight.md}px;
    .fixed-header {
      height: ${props => props.theme.HeaderHeight.md}px;
    }
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding-top: ${props => props.theme.HeaderHeight.xl}px;
    .fixed-header {
      height: ${props => props.theme.HeaderHeight.xl}px;
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
    max-width: 100%;
  }
`;

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

export const TitleNav = styled.div`
  display: flex;
  width: auto;
  min-width: 200px;

  @media (max-width: ${desktopWidth}) {
    min-width: 0;
    max-width: calc(100vw - 150px);
  }
`;
