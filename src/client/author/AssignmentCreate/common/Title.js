import { smallDesktopWidth, white } from "@edulastic/colors";
import styled from "styled-components";

const Title = styled.p`
  font-size: 22px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  color: ${white};
  display: inline-block;

  @media (max-width: ${smallDesktopWidth}) {
    font-size: 18px;
  }
`;

export default Title;
