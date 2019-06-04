import { mainBgColor, mobileWidth } from "@edulastic/colors";
import styled from "styled-components";

const ContainerWrapper = styled.div`
  padding: 20px 40px;
  background: ${mainBgColor};

  @media (max-width: ${mobileWidth}) {
    padding: 10px 25px;
  }
`;

export default ContainerWrapper;
