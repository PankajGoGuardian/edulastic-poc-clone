import styled from "styled-components";
import { white, desktopWidth, greyThemeDark2, mediumDesktopExactWidth } from "@edulastic/colors";

export const Container = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  overflow: hidden;
  justify-content: center;
  flex-basis: 50%;

  @media screen and (max-width: ${desktopWidth}) {
    flex-basis: 100%;
    height: auto;
    margin-top: 10px;
    justify-content: space-between;
    overflow: auto;
  }
`;

export const Link = styled.div`
  cursor: pointer;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  border: none;
  box-shadow: none;
  align-items: center;
  justify-content: center;
  background: ${props => (props.active === "true" ? "#b3bcc4" : "#f2f3f2")};
  color: ${props => (props.active === "true" ? white : greyThemeDark2)};
  white-space: nowrap;
  border-radius: 5px;
  margin: 0 3px;
  padding: 0 20px;
  height: 36px;

  &:last-child {
    margin-right: 30px;
  }

  svg {
    fill: ${props => (props.active === "true" ? white : "rgba(255,255,255,0.7)")};
    margin-right: 15px;
    display: none;
  }
  &:hover {
    border-bottom: none;

    svg {
      fill: ${props => (props.active === "true" ? white : "rgba(255,255,255,0.7)")};
    }
  }

  @media screen and (min-width: ${mediumDesktopExactWidth}) {
    margin: 0 5px;
    padding: 0 25px;
    height: 40px;
    svg {
      display: block;
    }
  }
  @media screen and (max-width: ${desktopWidth}) {
    padding: 0 10px;
    flex-basis: 24%;
    margin: 0px;
    &:last-child {
      margin-right: 0px;
    }
  }
`;
