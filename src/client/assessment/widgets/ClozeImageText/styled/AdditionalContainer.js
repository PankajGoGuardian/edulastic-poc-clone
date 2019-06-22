import styled from "styled-components";
import { tabletWidth } from "@edulastic/colors";

export const AdditionalContainer = styled.div`
  margin-top: 40px;
  @media screen and (max-width: ${tabletWidth}) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .additional-options {
      margin: 4px 0px;
    }
  }
`;
