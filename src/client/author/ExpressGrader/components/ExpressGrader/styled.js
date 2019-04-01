import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { mobileWidth } from "@edulastic/colors";

export const PaginationInfo = styled.span`
  font-weight: 600;
  display: inline-block;
  font-size: 11px;
  word-spacing: 5px;
  a {
    color: #69727e;
  }
  @media (max-width: ${mobileWidth}) {
    display: none;
  }
`;

export const StyledFlexContainer = styled(FlexContainer)`
  margin: 30px auto;
  width: 95%;
  @media (max-width: ${mobileWidth}) {
    margin: 15px auto;
  }
`;
