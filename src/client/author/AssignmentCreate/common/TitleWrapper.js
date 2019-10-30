import styled from "styled-components";
import { extraDesktopWidthMax, mediumDesktopExactWidth } from "@edulastic/colors";

const TitleWrapper = styled.div`
  font-weight: bold;
  font-size: ${props => props.theme.titleSecondarySectionFontSize};
  margin: 10px 0 20px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.subtitleFontSize};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${props => props.theme.headerTitle};
  }
`;

export default TitleWrapper;
