import styled from "styled-components";
import { lightGrey } from "@edulastic/colors";

const CardComponent = styled.div`
  width: 350px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  margin-right: 30px;
  background-color: ${lightGrey};
  border-radius: 10px;
  min-height: 420px;
`;

export default CardComponent;
