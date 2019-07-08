import styled from "styled-components";
import { white } from "@edulastic/colors";

const Paper = styled.div`
  border-radius: ${props => (props.borderRadius ? props.borderRadius : "10px")};
  background: ${white};
  padding: ${props => (props.padding ? props.padding : props.isV1Multipart ? "0px" : "30px")};
  box-shadow: ${props => (props.boxShadow ? props.boxShadow : "none")};
  width: ${({ width }) => (!width ? null : width)};
  @media (max-width: 480px) {
    padding: 28px;
  }
`;

export default Paper;
