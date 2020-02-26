import styled from "styled-components";

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  & > input {
    background-color: transparent;
    color: ${props => props.theme.widgets.shortText.inputColor};
    border-color: ${props => props.theme.widgets.shortText.inputBorderColor};
    &:hover {
      border-color: ${props => props.theme.widgets.shortText.inputHoverBorderColor};
    }
  }
`;
