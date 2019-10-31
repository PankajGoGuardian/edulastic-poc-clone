import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { MAX_MOBILE_WIDTH } from "../../constants/others";

const HeaderWrapper = styled(FlexContainer)`
  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    flex-direction: column;
    width: 100%;
  }
`;

export default HeaderWrapper;
