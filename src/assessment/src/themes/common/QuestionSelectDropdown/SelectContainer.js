import styled from 'styled-components';

const SelectContainer = styled.div`
  position: relative;
  width: 200px;
  height: 58px;
  &:before {
    position: absolute;
    font-family: 'FontAwesome';
    top: 0;
    right: 25px;
    display: flex;
    align-items: center;
    height: 100%;
    color: ${props => props.theme.selectArrowColor};
    content: "\f0d7";
  }
  @media (max-width: 760px) {
    height: 52px;
    width: 188px;
  }
`;

export default SelectContainer;
