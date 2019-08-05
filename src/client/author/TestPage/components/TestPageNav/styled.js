import styled from "styled-components";
import { white, desktopWidth, mediumDesktopWidth } from "@edulastic/colors";

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
  color: ${white};
  padding: 0 25px;
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
  background: ${props => (props.active === "true" ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.15)")};
  color: ${props => (props.active === "true" ? white : "rgba(255, 255, 255, 0.75)")};
  border-bottom: none;
  white-space: nowrap;
  border-radius: 5px;
  margin: 0 5px;

  &:last-child {
    margin-right: 30px;
  }

  svg {
    fill: ${props => (props.active === "true" ? white : "rgba(255,255,255,0.7)")};
  }
  &:hover {
    border-bottom: none;

    svg {
      fill: ${props => (props.active === "true" ? white : "rgba(255,255,255,0.7)")};
    }
  }

  @media screen and (max-width: ${mediumDesktopWidth}) {
    margin: 0 3px;
    padding: 0 20px;
    height: 36px;
    svg {
      display: none;
    }
  }
`;
