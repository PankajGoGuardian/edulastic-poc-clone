import styled from 'styled-components';

export const ControlButton = styled.button`
  width: 100px;
  height: 100px;
  white-space: normal;
  border-radius: 4px;
  border: none;
  outline: none;
  display: flex;
  background: transparent;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.36;
  color: #434b5d;
  cursor: pointer;

  &:not([disabled]) {
    background: white;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.06);
  }
`;
