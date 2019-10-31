import styled from "styled-components";
import { desktopWidth, mediumDesktopExactWidth, smallDesktopWidth } from "@edulastic/colors";

export const Subtitle = styled.div`
  font-size: ${({ fontSize, theme }) => fontSize || theme.common.subtitleFontSize};
  font-weight: ${props => props.theme.common.subtitleFontWeight};
  font-style: ${props => props.theme.common.subtitleFontStyle};
  font-stretch: ${props => props.theme.common.subtitleFontStretch};
  line-height: 1.36;
  letter-spacing: 0;
  text-align: left;
  color: ${({ color, theme }) => color || theme.common.subtitleColor};
  padding: 0;
  margin: ${props => (props.margin ? props.margin : "0 0 25px")};

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${({ theme }) => theme?.common?.titleSecondarySectionFontSize || "18px"};
  }
  @media (max-width: ${desktopWidth}) {
    margin-bottom: 20px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${({ theme }) => theme?.common?.titleSectionFontSize || "16px"};
  }
`;
