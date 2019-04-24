import styled from "styled-components";
import { mobileWidth } from "@edulastic/colors";

export const ResponseQuestion = styled.div`
  border-radius: 5px;
  background: ${props => props.background};
  padding: 0px 0px 30px;
  @media (max-width: ${mobileWidth}) {
    padding: 10px;

    & > div {
      width: 100%;
    }
  }
`;
