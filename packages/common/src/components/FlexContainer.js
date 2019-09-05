import styled from "styled-components";
import { mobileWidthMax, mediumDesktopWidth } from "@edulastic/colors";

const FlexContainer = styled.div`
  display: flex;
  align-items: ${props => (props.alignItems ? props.alignItems : "center")};
  justify-content: ${props => (props.justifyContent ? props.justifyContent : "space-evenly")};
  flex-direction: ${props => (props.flexDirection ? props.flexDirection : "row")};
  margin-bottom: ${({ marginBottom }) => (!marginBottom ? null : marginBottom)};
  padding: ${props => (props.padding ? props.padding : "0px")};
  flex-wrap: ${({ flexWrap }) => flexWrap || null};
  & > * {
    margin-right: ${({ childMarginRight }) => (childMarginRight !== undefined ? childMarginRight : 10)}px;
  }
  & > *:last-child {
    margin-right: 0;
  }
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
