import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { MAX_MOBILE_WIDTH } from "../../constants/others";

const HeaderWrapper = styled(FlexContainer)`
  width: 100%;
  ${props => props.headerStyle};

  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    flex-direction: column;
  }
`;

export default HeaderWrapper;
