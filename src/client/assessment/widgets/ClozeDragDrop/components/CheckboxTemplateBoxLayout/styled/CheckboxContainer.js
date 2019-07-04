import styled from "styled-components";

export const CheckboxContainer = styled.span`
  p {
    margin-bottom: 0px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: block;
    width: ${({ width }) => width - 60}px;
  }
`;
