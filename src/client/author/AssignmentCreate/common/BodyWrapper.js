import styled from "styled-components";
import { white, mobileWidthMax } from "@edulastic/colors";

const BodyWrapper = styled.div`
  padding: 40px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${white};

  @media (max-width: ${mobileWidthMax}) {
    padding: 20px;
  }
`;
export default BodyWrapper;
