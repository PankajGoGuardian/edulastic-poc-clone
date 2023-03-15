import React from 'react'
import PropTypes from 'prop-types'
import { CalcTitle, CloseIcon, TitleContainer } from './styled-components'

export const CalculatorTitle = ({ title, onClose, calcId }) => (
  <TitleContainer className="calculator-drag-handler">
    <CloseIcon onClick={onClose} />
    <CalcTitle data-cy={calcId}>{title}</CalcTitle>
  </TitleContainer>
)

CalculatorTitle.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}
