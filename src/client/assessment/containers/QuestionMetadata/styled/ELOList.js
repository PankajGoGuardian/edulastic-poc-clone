import styled from "styled-components";
import { lightGreySecondary } from "@edulastic/colors";

export const ELOList = styled.div`
  max-height: 40vh;
  overflow-y: auto;
  padding: ${props => (props.padding ? props.padding : "15px")};
  width: 100%;
  border: ${props => (props.border ? props.border : ` 1px solid ${lightGreySecondary}`)};
`;

export const EloText = styled.div`
  padding-left: 15px;
`;
