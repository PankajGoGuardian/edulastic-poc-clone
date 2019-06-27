import {
  blue,
  darkBlue,
  themeColor,
  darkBlueSecondary,
  mobileWidth,
  white,
  desktopWidth,
  btnBg,
  btnColor,
  btnBgActive
} from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import styled from "styled-components";
import { Link } from "react-router-dom";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";

export const Container = styled(HeaderWrapper)`
  padding: 0px 20px;
  height: 62px;
  display: flex;
  align-items: center;
  background: ${props => props.theme.header.headerBgColor};

  @media (max-width: ${mobileWidth}) {
    margin-bottom: 20px;
    margin-top: 20px;
    height: 100px;
  }
`;

export const ExtraFlex = styled(FlexContainer)`
  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
    max-width: 100%;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: ${mobileWidth}) {
    padding-bottom: 0;
    padding-top: 0;
    width: 100%;
    max-width: 100%;
    margin: 0;
  }
`;

export const RightSide = styled.div`
  text-align: right;
  flex: 1;
  position: relative;

  @media (max-width: ${mobileWidth}) {
    position: static;
    width: 100vw;
    height: 40px;
    max-height: 40px;
    margin-top: auto;
    background: ${themeColor};
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 25px;
    display: flex;
    margin-top: 20px;

    &:after {
      content: "";
      display: inline-block;
      width: 25px;
      height: 40px;
    }

    > div > div {
      justify-content: initial;
    }

    .btn {
      &-edit,
      &-preview,
      &-source,
      &-settings {
        height: 40px;
        width: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        background: ${btnBg};
        font-size: 11px;
        text-transform: uppercase;
        color: ${btnColor};
        margin-right: 10px;
        transition: all 0.3s ease;

        svg {
          fill: ${btnColor};
          transition: all 0.3s ease;
        }

        &:last-child {
          margin-right: 25px;
        }

        &:hover {
          background: ${btnBg};
        }

        &.active {
          background: ${btnBgActive};
          color: ${white};

          svg {
            fill: ${white};
          }
        }
      }
      &-save {
        font-size: 0;
        position: absolute;
        top: 11px;
        right: 26px;
        background: ${white};
        border-radius: 4px;
        height: 40px;
        width: 45px;
        padding: 0;

        > div {
          margin-right: 0;
        }

        &:hover {
          background: ${white};
        }

        svg {
          width: 20px;
          height: 20px;
          fill: ${themeColor};
        }
      }
    }
  }
`;

export const Title = styled.div`
  font-size: 22px;
  white-space: nowrap;
  font-weight: 700;
  line-height: 1.36;
  color: ${white};

  @media (max-width: ${mobileWidth}) {
    font-size: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ToggleButton = styled.div`
  color: #fff;
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
  display: none;

  @media (max-width: ${desktopWidth}) {
    display: block;
    margin-right: 26px;
  }
`;

export const Back = styled(Link)`
  color: ${white};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;

  :hover {
    color: ${blue};
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
