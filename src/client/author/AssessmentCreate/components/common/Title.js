import { mediumDesktopWidth, white } from "@edulastic/colors";
import styled from "styled-components";

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  color: ${white};
  margin: 0px;
  padding: 0px;

  @media screen and (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
  }
`;

export default Title;
