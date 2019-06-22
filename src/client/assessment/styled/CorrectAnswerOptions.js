import styled from "styled-components";

export const CorrectAnswerOptions = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 10px 0;
  flex-wrap: wrap;

  & .option {
    width: 50%;
    text-align: left;
  }

  & input {
  }

  .additional-options {
    white-space: nowrap;
    margin-right: 0px;
  }
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0px;
  }
`;
