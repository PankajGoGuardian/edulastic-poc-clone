import styled from 'styled-components'
import { darkGrey1 } from '@edulastic/colors'

const StyledSpinner = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: ${({ zIndex }) => zIndex || '5000'};
  transform: translate(-50%, -50%) rotate(90deg);
  display: block;
  font-size: 0;
  color: #ddd;
  height: ${({ size }) => size || 50};
  width: ${({ size }) => size || 50};
  > div {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 5000;
    transform: translate(-50%, -50%) rotate(90deg);
    display: inline-block;
    float: none;
    background-color: currentColor;
    border: 0 solid currentColor;
    margin-top: -4px;
    margin-left: -4px;
    border-radius: 100px;
    height: 25%;
    width: 23%;
    border-radius: 50%;
    color: ${({ color }) => color || darkGrey1};
    animation: ball-spin-clockwise 1s infinite ease-in-out;
  }

  > div:nth-child(1) {
    top: 5%;
    left: 50%;
    animation-delay: -0.875s;
  }

  > div:nth-child(2) {
    top: 18.1801948466%;
    left: 81.8198051534%;
    animation-delay: -0.75s;
  }

  > div:nth-child(3) {
    top: 50%;
    left: 95%;
    animation-delay: -0.625s;
  }

  > div:nth-child(4) {
    top: 81.8198051534%;
    left: 81.8198051534%;
    animation-delay: -0.5s;
  }

  > div:nth-child(5) {
    top: 94.9999999966%;
    left: 50.0000000005%;
    animation-delay: -0.375s;
  }

  > div:nth-child(6) {
    top: 81.8198046966%;
    left: 18.1801949248%;
    animation-delay: -0.25s;
  }

  > div:nth-child(7) {
    top: 49.9999750815%;
    left: 5.0000051215%;
    animation-delay: -0.125s;
  }

  > div:nth-child(8) {
    top: 18.179464974%;
    left: 18.1803700518%;
    animation-delay: 0s;
  }

  @-webkit-keyframes ball-spin-clockwise {
    0% {
      transform: scale(1);
    }

    12.5% {
      transform: scale(0.825);
    }

    25% {
      transform: scale(0.75);
    }

    37.5% {
      transform: scale(0.625);
    }

    50% {
      transform: scale(0.5);
    }

    62.5% {
      transform: scale(0.375);
    }

    75% {
      transform: scale(0.25);
    }

    87.5% {
      transform: scale(0.125);
    }

    100% {
      transform: scale(0);
    }
  }

  @-moz-keyframes ball-spin-clockwise {
    0% {
      transform: scale(1);
    }

    12.5% {
      transform: scale(0.825);
    }

    25% {
      transform: scale(0.75);
    }

    37.5% {
      transform: scale(0.625);
    }

    50% {
      transform: scale(0.5);
    }

    62.5% {
      transform: scale(0.375);
    }

    75% {
      transform: scale(0.25);
    }

    87.5% {
      transform: scale(0.125);
    }

    100% {
      transform: scale(0);
    }
  }

  @-o-keyframes ball-spin-clockwise {
    0% {
      transform: scale(1);
    }

    12.5% {
      transform: scale(0.825);
    }

    25% {
      transform: scale(0.75);
    }

    37.5% {
      transform: scale(0.625);
    }

    50% {
      transform: scale(0.5);
    }

    62.5% {
      transform: scale(0.375);
    }

    75% {
      transform: scale(0.25);
    }

    87.5% {
      transform: scale(0.125);
    }

    100% {
      transform: scale(0);
    }
  }

  @keyframes ball-spin-clockwise {
    0% {
      transform: scale(1);
    }

    12.5% {
      transform: scale(0.825);
    }

    25% {
      transform: scale(0.75);
    }

    37.5% {
      transform: scale(0.625);
    }

    50% {
      transform: scale(0.5);
    }

    62.5% {
      transform: scale(0.375);
    }

    75% {
      transform: scale(0.25);
    }

    87.5% {
      transform: scale(0.125);
    }

    100% {
      transform: scale(0);
    }
  }
`

export default StyledSpinner
