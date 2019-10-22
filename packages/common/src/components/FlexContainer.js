import styled from "styled-components";
import { mobileWidthMax, mediumDesktopWidth } from "@edulastic/colors";

// Only add generic styles in this component. It is being used many places adding styles to its child component may have very bad impact.

const FlexContainer = styled.div`
  display: ${({ display }) => display || "flex"};
  align-items: ${props => (props.alignItems ? props.alignItems : "center")};
  justify-content: ${props => (props.justifyContent ? props.justifyContent : "space-evenly")};
  align-items: ${({ alignItems }) => alignItems || null};
  flex-direction: ${props => (props.flexDirection ? props.flexDirection : "row")};
  margin-bottom: ${({ marginBottom }) => (!marginBottom ? null : marginBottom)};
  padding: ${props => (props.padding ? props.padding : "0px")};
  flex-wrap: ${({ flexWrap }) => flexWrap || null};
  width: ${({ width }) => width || "auto"};
  max-width: ${({ maxWidth }) => maxWidth || null};
  ${({ flexProps }) => flexProps};
  div:not(.fr-element.fr-view) p {
    padding: 6px 0px;
  }

  @media (max-width: ${mediumDesktopWidth}) {
    button svg {
      display: inline-block;
    }
  }

  @media (max-width: ${mobileWidthMax}) {
    flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  }
`;

export default FlexContainer;
