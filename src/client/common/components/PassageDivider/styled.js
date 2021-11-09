import styled, { css } from 'styled-components'
import { fadedGrey } from '@edulastic/colors'

const backgrounds = {
  left: css`
    &::before {
      left: 0px;
      height: 100%;
      width: 50%;
      border-radius: 50px 0px 0px 50px;
    }
  `,
  right: css`
    &::before {
      right: 0px;
      height: 100%;
      width: 50%;
      border-radius: 0px 50px 50px 0px;
    }
  `,
}

export const Container = styled.div`
  width: 48px;
  height: 48px;
  position: ${({ isInModal }) => (isInModal ? 'absolute' : 'fixed')};
  background: #8a9dac;
  border-radius: 50px;
  bottom: 24px;
  left: ${({ isInModal }) => (isInModal ? 'calc(50% - 24px)' : '50%')};
  z-index: 1100;
  display: flex;
  align-items: stretch;
  justify-content: center;
  cursor: pointer;

  .collapse {
    flex: 1;
    height: 100%;
    display: flex;
    position: relative;
    z-index: 1;
    align-items: center;
    justify-content: center;

    &.left {
      border-radius: 50px 0px 0px 50px;
    }

    &.right {
      border-radius: 0px 50px 50px 0px;
    }

    svg {
      width: 6px;
      height: 11px;
      fill: ${fadedGrey};
      &:hover {
        fill: ${fadedGrey};
      }
    }
  }

  .vertical-lines {
    width: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;

    .vertical-line {
      border: 1px solid ${fadedGrey};
      height: 16px;
    }
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    background: #3f84e5;
    z-index: 0;
  }

  ${({ dir }) => backgrounds[dir]}
`
