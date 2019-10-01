import styled from "styled-components";

export const InputWrapper = styled.div`
  position: relative;
  & > input {
    background-color: transparent;
    color: ${props => props.theme.widgets.shortText.inputColor};
    border-color: ${props => props.theme.widgets.shortText.inputBorderColor};
    &:hover {
      border-color: ${props => props.theme.widgets.shortText.inputHoverBorderColor};
    }
  }
`;
