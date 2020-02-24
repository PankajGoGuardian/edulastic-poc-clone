import styled from "styled-components";
import { mobileWidthMax } from "@edulastic/colors";

const FlexWrapper = styled.div`
  visibility: visible;
  display: flex;
  width: 100%;
  justify-content: ${props => props.justifyContent || "center"};
  margin-bottom: ${({ marginBottom }) => marginBottom || "20px"};

  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`;

export default FlexWrapper;
