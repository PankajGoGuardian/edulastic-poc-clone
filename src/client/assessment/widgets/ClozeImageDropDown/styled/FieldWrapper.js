import styled from "styled-components";
import { tabletWidth } from "@edulastic/colors";

export const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  white-space: nowrap;
`;

export const MaxRespCountWrapper = styled(FieldWrapper)`
  margin-top: 16px;

  @media screen and (max-width: ${tabletWidth}) {
    flex-direction: column-reverse;
    align-items: flex-start;
    margin-top: 4px;
  }
`;
