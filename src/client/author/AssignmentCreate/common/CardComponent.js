import styled from "styled-components";
import { lightGrey, mobileWidthMax } from "@edulastic/colors";

const CardComponent = styled.div`
  flex-basis: 47%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: ${lightGrey};
  border-radius: 10px;
  min-height: 420px;

  @media (max-width: ${mobileWidthMax}) {
    min-height: unset;
    flex-basis: 100%;
    margin-bottom: 10px;
  }
`;

export default CardComponent;
