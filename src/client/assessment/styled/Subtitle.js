import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";

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
  margin-bottom: 29px;

  @media screen {
    padding: 0;
  }

  @media (max-width: ${desktopWidth}) {
    margin-bottom: 20px;
  }
`;
