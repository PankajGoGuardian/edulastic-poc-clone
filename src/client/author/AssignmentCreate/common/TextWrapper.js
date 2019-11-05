import styled from "styled-components";
import { textColor, extraDesktopWidthMax } from "@edulastic/colors";

const TextWrapper = styled.div`
  margin-bottom: 20px;
  text-align: center;
  color: ${textColor};
  line-height: 20px;
  font-size: ${props => props.theme.smallFontSize};

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${props => props.theme.standardFont};
    line-height: 26px;
  }
`;
export default TextWrapper;
