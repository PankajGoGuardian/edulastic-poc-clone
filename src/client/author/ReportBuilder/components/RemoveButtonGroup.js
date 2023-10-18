import React from 'react'
import * as PropTypes from 'prop-types'
import { Button } from 'antd'
import styled from 'styled-components'
import removeButtonSvg from '../../Dashboard/assets/svgs/remove-button.svg'

const StyledButton = styled.a`
  height: 16px;
  width: 16px;
  background-image: url(${removeButtonSvg});
  display: block;
  position: absolute;
  right: -5px;
  top: -5px;
  z-index: 9;
  display: none;

  &:hover {
    background-position: 16px 0;
    display: block;
  }
`

export const RemoveButtonGroup = ({
  onRemoveClick,
  children,
  display,
  ...props
}) => (
  <Button.Group style={{ marginRight: 8 }} {...props}>
    {children}
    <StyledButton onClick={onRemoveClick} />
  </Button.Group>
)

RemoveButtonGroup.propTypes = {
  onRemoveClick: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
}
