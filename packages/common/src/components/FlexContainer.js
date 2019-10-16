import styled from "styled-components";
import { mobileWidthMax, mediumDesktopWidth } from "@edulastic/colors";

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

  ${({ flexProps }) => flexProps};
  div:not(.fr-element.fr-view) p {
    padding: 6px 0px;
  }

  @media (max-width: ${mediumDesktopWidth}) {
    & > * {
      margin-right: 3px;
    }
    button svg {
      display: inline-block;
    }
  }

  @media (max-width: ${mobileWidthMax}) {
    flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  }
`;

export default FlexContainer;
