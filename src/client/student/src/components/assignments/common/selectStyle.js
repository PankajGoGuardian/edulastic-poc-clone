import styled from 'styled-components';

const SelectStyle = styled.select`
  border: none;
  position: absolute;
  right: 0;
  padding: 16px;
  background: #fff;
  outline: none;
  -webkit-appearance: none;
  width: 5.7rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: grey;
  cursor: pointer;
  &:hover {
    background-color: rgba(74, 172, 139, 0.05);
  }
  @media (amx-width: 1060px) {
    width: 6.3rem;
  }
  @media (max-width: 900px) {
    width: 7.2rem;
    padding: 16px;
  }
  @media (max-width: 768px) {
    width: 50%;
  }
`;

export default SelectStyle;
