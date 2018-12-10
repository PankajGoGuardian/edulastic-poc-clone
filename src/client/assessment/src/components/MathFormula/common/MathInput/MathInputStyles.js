import styled from 'styled-components';
import { grey, lightRed, lightGreen, white } from '@edulastic/colors';

const MathInputStyles = styled.div`
  .input {
    position: relative;
  }

  .input__math {
    display: inline-block;
    width: 100%;
    padding-right: 40px;
    position: relative;
    border-radius: 5px;
    border: 1px solid ${grey};

    &.clear {
      background: ${white};
    }
    &.wrong {
      background: ${lightRed};
    }
    &.success {
      background: ${lightGreen};
    }
  }

  .input__math__field {
    height: 66px;
    width: 100%;
    border: 0;

    &.mq-focused {
      box-shadow: none;
    }
  }

  .input__math__icon {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 16px;
  }

  .input__keyboard {
    position: absolute;
    top: 70px;
    left: 0px;
    right: 0px;
    z-index: 999;
  }
`;

export default MathInputStyles;
