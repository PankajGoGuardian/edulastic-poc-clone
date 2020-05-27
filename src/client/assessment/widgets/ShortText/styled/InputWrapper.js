import styled from "styled-components";

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  & > input {
    background-color: transparent;
    color: ${theme => theme.questionTextColor};
    border-color: ${props => props.theme.widgets.shortText.inputBorderColor};
    &:hover {
      border-color: ${props => props.theme.widgets.shortText.inputHoverBorderColor};
    }
  }
`;
