import styled from "styled-components";

export const CheckboxContainer = styled.div`
  position: absolute;
  & input {
    opacity: 0;
    display: none;
  }
`;

CheckboxContainer.displayName = "MCQCheckboxContainer";
