import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";
import { previewFontSize, previewFontSizeMobile, previewFontWeight } from "@edulastic/fonts";

const FlexContainer = styled.div`
  display: flex;
  align-items: ${props => (props.alignItems ? props.alignItems : "center")};
  justify-content: ${props => (props.justifyContent ? props.justifyContent : "space-evenly")};
  flex-direction: ${props => (props.flexDirection ? props.flexDirection : "row")};
  margin-bottom: ${({ marginBottom }) => (!marginBottom ? null : marginBottom)};
  & > * {
    margin-right: ${({ childMarginRight }) => (childMarginRight !== undefined ? childMarginRight : 10)}px;
  }
  & > *:last-child {
    margin-right: 0;
  }
  p {
    font-size: ${previewFontSize};
    font-weight: ${previewFontWeight};

    @media (max-width: ${desktopWidth}) {
      font-size: ${previewFontSizeMobile};
    }
  }
  div:not(.fr-element.fr-view) p {
    padding: 6px 0px;
  }
`;

export default FlexContainer;
