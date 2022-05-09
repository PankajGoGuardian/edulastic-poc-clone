import React from 'react'
import styled from 'styled-components'

const ToggleSwitch = ({ checked, onChange }) => (
  <Wrapper>
    <Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <Slider round />
  </Wrapper>
)

export default ToggleSwitch

const Wrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  border-radius: 100px;
`

const Checkbox = styled.input.attrs({
  type: 'checkbox',
})`
  display: none;
`

const Slider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  transition: 0.4s;

  cursor: pointer;
  background-color: #ccc;
  border-radius: 34px;

  ${Checkbox}:checked + & {
    background-color: #3f85e5;
  }

  ${Checkbox}:focus + & {
    box-shadow: 0 0 1px #3b97d3;
  }

  &:before {
    position: absolute;
    content: '';
    left: 4px;
    bottom: 4px;

    transition: 0.4s;

    height: 12px;
    width: 12px;
    background-color: white;
    border-radius: 100px;

    ${Checkbox}:checked + & {
      transform: translateX(20px);
    }
  }
`
