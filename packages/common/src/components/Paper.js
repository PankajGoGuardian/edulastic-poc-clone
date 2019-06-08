import styled from "styled-components";
import { white } from "@edulastic/colors";

const Paper = styled.div`
  border-radius: ${props => (props.borderRadius ? props.borderRadius : "10px")};
  background: ${white};
  padding: ${props => (props.padding ? props.padding : "35px 43px")};
  box-shadow: ${props => (props.boxShadow ? props.boxShadow : "0 3px 10px 0 rgba(0, 0, 0, 0.1)")};
  width: ${({ width }) => (!width ? null : width)} @media (max-width: 480px) {
    padding: 28px;
  }
`;

export default Paper;
