import React from 'react'
import { SelectInputStyled, MathFormulaDisplay } from '@edulastic/common'

const radiansList = [
  {
    value: 1,
    label: '\\pi',
  },
  {
    value: 2,
    label: '\\frac{\\pi}{2}',
  },
  {
    value: 3,
    label: '\\frac{\\pi}{3}',
  },
  {
    value: 4,
    label: '\\frac{\\pi}{4}',
  },
  {
    value: 5,
    label: '\\frac{\\pi}{5}',
  },
  {
    value: 8,
    label: '\\frac{\\pi}{8}',
  },
]

const { Option } = SelectInputStyled

const RadiansDropdown = ({ name, value, onSelect }) => {
  const handleSelect = (val) => {
    onSelect(+val)
  }

  return (
    <SelectInputStyled
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      onChange={handleSelect}
      value={value}
      height="35px"
      showArrow={false}
      data-cy={name}
      padding="0px 12px"
    >
      {radiansList.map((option) => (
        <Option key={option.value} value={option.value}>
          <MathFormulaDisplay
            fontSize="11px"
            dangerouslySetInnerHTML={{
              __html: `<span class="input__math" data-latex="${option.label}"></span>`,
            }}
          />
        </Option>
      ))}
    </SelectInputStyled>
  )
}

export default RadiansDropdown
