import styled from "styled-components";
import { middleMobileWidth } from "@edulastic/colors";

export const FlexContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent || "space-between"};

  & > div {
    display: flex;
  }
`;

export const BottomActionContainer = styled(FlexContainer)`
  @media screen and (max-width: ${middleMobileWidth}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
