import styled from 'styled-components';

const SelectStyle = styled.select`
  border: none;
  position: absolute;
  right: 0;
  padding: 16px;
  background: #fff;
  outline: none;
  -webkit-appearance: none;
  width: 8.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: grey;
  cursor: pointer;
  &:hover {
    background-color: rgba(74, 172, 139, 0.05);
  }

  @media (max-width: 900px) {
    width: 8rem;
    padding: 16px;
  }
  @media (max-width: 768px) {
    width: 50%;
  }
`;

export default SelectStyle;
