import {
  newBlue,
  darkBlueSecondary,
  mobileWidth,
  white,
  desktopWidth,
  btnColor,
  btnBg,
  btnBgActive
} from "@edulastic/colors";
import styled from "styled-components";
import { Link } from "react-router-dom";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";

export const Container = styled.div`
  display: flex;
  align-items: center;
  background: ${darkBlueSecondary};
  padding: 0px 40px;
  height: 62px;

  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
    height: auto;
    width: 100vw;
    max-width: 100vw;
    margin: 0 -26px;
    padding: 0 26px;
    flex-wrap: wrap;
    align-items: flex-start;
    background: transparent;

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
          fill: ${newBlue};
        }
      }
    }
  }
`;

export const MobileContainer = styled(HeaderWrapper)`
  display: flex;
  flex-direction: column;
  padding: 16px 10px 0px 40px;
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${mobileWidth}) {
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
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 25px;
    display: flex;
    margin-top: 20px;
    margin-left: -26px;

    &:after {
      content: "";
      display: inline-block;
      width: 25px;
      height: 40px;
    }

    > div > div {
      padding-bottom: 0;
    }
  }
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  color: ${white};

  @media (max-width: ${mobileWidth}) {
    font-size: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Back = styled(Link)`
  color: ${white};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;

  :hover {
    color: ${newBlue};
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

export const ToggleButton = styled.div`
  color: ${white};
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
  display: none;

  @media (max-width: ${desktopWidth}) {
    display: block;
    margin-right: 26px;
  }
`;
