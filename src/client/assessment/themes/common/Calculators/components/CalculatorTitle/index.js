import React from 'react'
import PropTypes from 'prop-types'
import { CalcTitle, CloseIcon, TitleContainer } from './styled-components'

export const CalculatorTitle = ({ title, onClose }) => (
  <TitleContainer className="calculator-drag-handler">
    <CloseIcon onClick={onClose} />
    <CalcTitle data-cy="SCIENTIFIC">{title}</CalcTitle>
  </TitleContainer>
)

CalculatorTitle.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}
