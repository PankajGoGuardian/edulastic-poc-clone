import styled from 'styled-components';

const FilterBtn = styled.button`
  margin-left: 10px;
  padding: 5px 15px;
  font-family: Open Sans;
  font-size: 11px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: 0.2px;
  text-align: left;
  color: #ffffff;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  white-space: nowrap;
  background-color: transparent;
  border: none;
  
  & span {
    opacity: 0.8;
    font-family: Open Sans;
    font-size: 24px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.38;
    letter-spacing: 0.4px;
    text-align: left;
    transform: uppercase;
    color: #ffffff;
    padding-right: 10px;
  }
  &:nth-last-of-type(1) {
    margin-right: 0;
  }

  @media screen and (max-width: 1420px){
    padding: 5px 15px;
  }
`;

export default FilterBtn;
