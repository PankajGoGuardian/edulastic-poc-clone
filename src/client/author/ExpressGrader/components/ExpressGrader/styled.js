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

export const ExpressGraderDetailContainer = styled.div`
  width: 100%;
  padding: 20px 30px;
`;

export const StyledFlexContainer = styled(FlexContainer)`
  margin-bottom: 20px;
  width: 100%;
`;
