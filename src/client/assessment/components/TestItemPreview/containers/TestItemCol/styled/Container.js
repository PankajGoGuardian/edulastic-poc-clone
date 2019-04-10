import styled from "styled-components";
import { mobileWidth } from "@edulastic/colors";

export const Container = styled.div`
  width: ${({ width }) => width};
  display: flex;
  flex-direction: column;
  border-right-color: ${props => props.theme.testItemPreview.itemColBorderColor};
  @media (max-width: ${mobileWidth}) {
    padding-left: 0px;
    margin-right: ${props => !props.value && "20px"};
    margin-left: ${props => props.value && "20px"};
  }
`;
