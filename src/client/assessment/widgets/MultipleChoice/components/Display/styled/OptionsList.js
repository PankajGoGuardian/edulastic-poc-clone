import styled from "styled-components";
import { mobileWidth } from "@edulastic/colors";

export const OptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-left: -25px;
  flex-direction: column;
  @media (max-width: ${mobileWidth}) {
    margin-left: -8px;
  }
`;
