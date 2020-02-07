import styled from "styled-components";

export const CorrectAnswerHeader = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: ${props => props.mt || "0px"};
  margin-bottom: ${props => props.mb || "0px"};
  label {
    margin-bottom: 0px;
    margin-right: 15px;
  }
`;
