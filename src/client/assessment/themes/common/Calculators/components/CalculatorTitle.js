import React from 'react'
import styled from 'styled-components'
import { greyThemeDark3 } from '@edulastic/colors'
import { IconClose } from '@edulastic/icons'

const CalculatorTitle = ({ title, onClose }) => (
  <Container className="calculator-drag-handler">
    <CloseIcon color={greyThemeDark3} onClick={onClose} />
    <Title data-cy="SCIENTIFIC">{title}</Title>
  </Container>
)

const Container = styled.div`
  position: relative;
`

const CloseIcon = styled(IconClose)`
  width: 12px;
  height: 12px;
  right: 8px;
  cursor: pointer;
  position: absolute;
  top: calc(50% - 6px);
`

const Title = styled.div`
  width: 100%;
  height: 40px;
  background: -webkit-linear-gradient(top, #f9f9f9, #e6e6e6);
  color: ${greyThemeDark3};
  font-size: 14px;
  line-height: 40px;
  padding: 0 0 2px 15px;
  font-weight: 600;
  text-align: left;
  cursor: move;
`

export default CalculatorTitle
