import styled from "styled-components";
import { lightGrey, mobileWidthMax } from "@edulastic/colors";

const CardComponent = styled.div`
  flex-basis: calc(50% - 20px);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: ${props => props.theme.brandLightGrey};
  border-radius: 10px;
  min-height: 400px;

  @media (max-width: ${mobileWidthMax}) {
    min-height: unset;
    flex-basis: 100%;
    margin-bottom: 10px;
  }
`;

export default CardComponent;
