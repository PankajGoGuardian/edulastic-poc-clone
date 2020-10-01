/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import { IconTrash, IconUndo, IconRedo, IconEraseText } from '@edulastic/icons'

export const ControlBtn = ({ control, onClick, active }) => {
  let icon = ''
  switch (control) {
    case 'trash':
      icon = <IconTrash />
      break
    case 'undo':
      icon = <IconUndo />
      break
    case 'redo':
      icon = <IconRedo />
      break
    case 'clear':
      icon = <IconEraseText />
      break
    default:
      break
  }

  return (
    <Button onClick={onClick} active={active}>
      {icon}
      {control}
    </Button>
  )
}

export const ControlBtnWraper = styled.div`
  display: flex;
  margin-bottom: ${({ marginBottom }) => marginBottom || 0}px;
  justify-content: ${({ justifyContent }) => justifyContent || 'flex-start'};
  padding: 4px 8px;
`

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-left: 10px;
  border-radius: 4px;
  width: 60px;
  height: 60px;
  text-transform: capitalize;
  color: ${(props) =>
    props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.25);
  background-color: white;
  font-size: ${({ theme }) => theme.size4}px;
  cursor: pointer;
  user-select: none;
  box-shadow: ${({ active }) =>
    active
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.25)'
      : '0 3px 6px 0 rgba(0, 0, 0, 0.25)'};
  svg {
    color: ${(props) =>
      props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
    fill: ${(props) =>
      props.theme.widgets.graphPlacement.buttonActiveLabelStroke};
  }

  &:first-child {
    margin-left: 0px;
  }
  &:hover,
  &:active,
  &.active {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.25);
  }
`
