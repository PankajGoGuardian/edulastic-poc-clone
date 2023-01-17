/* eslint-disable react/prop-types */
import React from 'react'
import { EduIf } from '@edulastic/common'
import styled from 'styled-components'
import { IconCheck } from '../styled/IconCheck'
import { IconClose } from '../styled/IconClose'

export const IconWrapper = ({ correct }) => (
  <Wrapper>
    <EduIf condition={correct}>
      <IconCheck aria-label=", Correct answer" />
    </EduIf>
    <EduIf condition={!correct}>
      <IconClose aria-label=", Incorrect answer" />
    </EduIf>
  </Wrapper>
)

const Wrapper = styled.div`
  width: 30px;
  right: 0px;
  height: 100%;
  position: absolute;
  border-radius: 4px;
  background: transparent;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`
