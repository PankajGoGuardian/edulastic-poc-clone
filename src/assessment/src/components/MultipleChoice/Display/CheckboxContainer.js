import styled from 'styled-components';

const CheckboxContainer = styled.div`
  width: ${props => (props.smallSize ? 22 : 30)}px;
  height: ${props => (props.smallSize ? 22 : 30)}px;
  padding: ${props => (props.smallSize ? 2 : 0)}px;
  border: solid 2px ${props => (props.smallSize ? '#b1b1b1' : '#1fe3a1')};
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
    display: ${props => (props.smallSize ? 'none' : 'flex')};
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #000;
    background-color: transparent;
    -webkit-transition: backgroundColor .6s;
    transition: backgroundColor .6s;
  }

  & div {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: 'transparent';
  }

  & input:checked + span {
    color: white;
    background-color: #1fe3a1;
    -webkit-transition: backgroundColor .6s;
    transition: backgroundColor .6s;
  }

  & input:checked + span + div {
    background-color: #1fe3a1;
    -webkit-transition: backgroundColor .6s;
    transition: backgroundColor .6s;
  }
`;

export default CheckboxContainer;
