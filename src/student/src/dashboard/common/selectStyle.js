import styled from 'styled-components';

const SelectStyle = styled.select`
  border: none;
  position: absolute;
  right: 0;
  padding: 16px;
  border: none;
  background: #fff;
  outline: none;
  -webkit-appearance: none;
  width: 4.7rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: grey;
  cursor: pointer;
  &:hover {
    background-color: rgba(74, 172, 139, 0.05);
  }
`;

export default SelectStyle;
