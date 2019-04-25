import styled from "styled-components";
import { mobileWidth, mainBgColor } from "@edulastic/colors";

export const Container = styled.div`
  padding: 20px 40px;
  background: ${mainBgColor};

  @media (max-width: ${mobileWidth}) {
    padding: 10px 25px;
  }
`;

export default Container;
