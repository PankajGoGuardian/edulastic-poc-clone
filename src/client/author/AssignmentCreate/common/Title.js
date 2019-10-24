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
  display: inline-block;
  margin: 0px;
  padding: 0px;

  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
  }
`;

const AlignMiddle = styled.div`
  font-weight: bold;
  position: absolute;
  left: 50%;
  transform: translate(-50px, 0px);
  color: ${white};
`;

export default Title;

export { AlignMiddle };
