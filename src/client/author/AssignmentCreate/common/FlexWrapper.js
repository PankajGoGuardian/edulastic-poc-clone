import styled from "styled-components";
import { mobileWidthMax } from "@edulastic/colors";

const FlexWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 800px;
  justify-content: space-around;
  margin-bottom: ${({ marginBottom }) => marginBottom || "20px"};

  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`;

export default FlexWrapper;
