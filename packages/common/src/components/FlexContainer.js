import styled from "styled-components";
import { smallDesktopWidth } from "@edulastic/colors";

const FlexContainer = styled.div`
  display: flex;
  align-items: ${props => (props.alignItems ? props.alignItems : "center")};
  justify-content: ${props => (props.justifyContent ? props.justifyContent : "space-evenly")};
  flex-direction: ${props => (props.flexDirection ? props.flexDirection : "row")};
  margin-bottom: ${({ marginBottom }) => (!marginBottom ? null : marginBottom)};
  padding: ${props => (props.padding ? props.padding : "0px")};
  & > * {
    margin-right: ${({ childMarginRight }) => (childMarginRight !== undefined ? childMarginRight : 10)}px;
  }
  & > *:last-child {
    margin-right: 0;
  }
  div:not(.fr-element.fr-view) p {
    padding: 6px 0px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    svg {
      display: none;
    }
    button svg {
      display: inline-block;
    }
  }
`;

export default FlexContainer;
