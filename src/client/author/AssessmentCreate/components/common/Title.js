import { white, mediumDesktopExactWidth } from "@edulastic/colors";
import styled from "styled-components";

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  color: ${white};
  margin: 0px;
  padding: 0px;

  @media screen and (min-width: ${mediumDesktopExactWidth}) {
    font-size: 22px;
  }
`;

export default Title;
