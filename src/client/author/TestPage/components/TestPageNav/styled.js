import styled from "styled-components";
import { white, desktopWidth } from "@edulastic/colors";

export const Container = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  overflow-y: hidden;
  overflow-x: scroll;
  justify-content: center;
  flex-basis:600px;

  @media screen and (min-width: ${desktopWidth}) {
    height: 60px
    overflow-y: unset;
    overflow-x: unset;
  }
`;

export const Link = styled.div`
  cursor: pointer;
  width: 102px;
  color: ${white};
  padding: 0 15px;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  border: none;
  box-shadow: none;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 0;
  background: #0288d1;
  background: ${props => (props.active === "true" ? "#057fc1" : "transparent")};
  border-bottom: none;
  white-space: nowrap;

  :first-child {
    @media screen and (min-width: ${desktopWidth}) {
      margin-left: 120px;
    }
  }

  @media screen and (max-width: ${desktopWidth}) {
    svg {
      display: none;
    }
  }

  @media screen and (min-width: ${desktopWidth}) {
    margin: 0 7px;
    width: 136px;
    height: 45px;
    border-radius: 5px;
    background: ${props => (props.active === "true" ? "#5196f3" : "#277df1")};
    color: ${props => (props.active === "true" ? white : "rgba(255,255,255,0.7)")};
    border-bottom: none;

    svg {
      fill: ${props => (props.active === "true" ? white : "rgba(255,255,255,0.7)")}
    }

    :hover {
      border-bottom: none;

       svg {
        fill: ${props => (props.active === "true" ? white : "rgba(255,255,255,0.7)")}
      }
    }

    :first-child {
      margin-left: 0;
    }
`;
