import styled from 'styled-components';

const CheckboxContainer = styled.div`
  width: ${props => (props.smallSize ? 22 : 30)}px;
  height: ${props => (props.smallSize ? 22 : 30)}px;
  padding: ${props => (props.smallSize ? 0 : 0)}px;
  border: solid 2px #1fe3a1;
  border-radius: 50%;
  box-sizing: border-box;
  margin-right: 10px;

  & input {
    opacity: 0;
    display: none;
  }

  & div {
    width: 100%;
    height: 100%;
    display: block;
    line-height: 1;
  }

  & span {
    width: 100%;
    height: 100%;
    display: ${props => (props.smallSize ? 'block' : 'flex')};
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #000;
    background-color: transparent;
    -webkit-transition: backgroundColor 0.6s;
    transition: backgroundColor 0.6s;
    text-align: center;
    font-size: ${props => (props.smallSize ? '15px' : '20px')};
  }

  & div {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: ${props => (props.smallSize ? 'block' : 'none')};
    background-color: 'transparent';
  }

  & input:checked + span {
    color: white;
    background-color: #1fe3a1;
    -webkit-transition: backgroundColor 0.6s;
    transition: backgroundColor 0.6s;
  }

  & input:checked + span + div {
    background-color: #1fe3a1;
    -webkit-transition: backgroundColor 0.6s;
    transition: backgroundColor 0.6s;
    display: none;
  }
`;

export default CheckboxContainer;
