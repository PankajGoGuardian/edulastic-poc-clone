import styled from 'styled-components';
import { grey, white } from '@edulastic/colors';

const MathKeyboardStyles = styled.div`
  .keyboard {
    display: inline-block;
    padding: 10px;
    border: 1px solid #b3b3b3;
    background: #fefefe;
    border-radius: 5px;
  }

  .keyboard__header {
    display: flex;
    justify-content: space-between;
  }

  .keyboard__header__select {
    width: 251.7px;
    border-radius: 5px;
    box-shadow: 0 2px 6px 0 rgba(219, 219, 219, 0.55);
    background-color: #ffffff;
    font-family: Open Sans;
    font-size: 13px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.38;
    letter-spacing: 0.2px;
    text-align: left;
    color: #434b5d;
    border: none;
    outline: none;
    margin-right: 10px;
  }
  .keyboard__header__select .ant-select-selection--single {
    border: none;
  }

  .keyboard__header__close {
    border-color: #d9d9d9;
  }

  .keyboard__types3 {
    display: flex;
    flex-wrap: wrap;
  }

  .keyboard__main {
    display: flex;
    flex-wrap: nowrap;
  }

  .half-box {
    width: 50%;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    max-height: 325px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .num {
    width: 25%;
    height: 65px;
    border-color: white;
    border-radius: 0;
    font-family: Open Sans;
    font-size: 16px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.38;
    letter-spacing: normal;
    text-align: center;
    color: #808080;

    :disabled,
    :disabled:hover {
      background: ${white};
      border-color: ${white};
    }

    :active {
      background-color: ${white};
    }

    :hover {
      background-color: ${grey};
    }
  }

  .num--type-1 {
    background-color: #e5e5e5;
  }

  .num--type-2 {
    background-color: #d1d1d1;
  }

  .num--type-3 {
    background-color: #d0edfd;
    color: #808080;
  }

  .italic {
    font-style: italic;
  }

  .num__image {
    object-fit: contain;
    width: 25px;
  }

  .num__image-sqrt {
    width: 25px;
  }

  .num__image-frac1 {
    width: 33px;
    margin-top: 12px;
  }

  .num__image-frac2 {
    width: 46px;
  }

  .num__image-expo {
    width: 24px;
    margin-top: -20px;
  }

  .num__image-log {
    width: 24px;
    margin-top: 20px;
  }

  .num__image-bracket {
    width: 30px;
  }

  .num__image-bar {
    width: 30px;
  }

  .num__image-back {
    width: 18.6px;
  }

  .num__equal {
    width: 100%;
    height: 25px;
  }

  .num__move {
    width: 50%;
    height: 15px;
  }

  .num__backspace {
    height: 17px;
  }
`;

export default MathKeyboardStyles;
