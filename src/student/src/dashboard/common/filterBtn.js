import styled from 'styled-components';

const FilterBtn = styled.button`
  border: none;
  height: 2.7rem;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.07);
  cursor: pointer;
  margin-right: 0.9rem;
  min-width: 5.9rem;
  font-size: 0.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  & span {
    margin-right: 0.5rem;
    color: grey;
    font-weight: 600;
    letter-spacing: 0.04rem;
    line-height: 1.375;
    font-size: 0.7rem;
    font-weight: 600;
  }
  &:nth-last-of-type(1) {
    margin-right: 0;
  }
  @media (max-width: 875px) {
    display: none;
  }
`;

export default FilterBtn;
