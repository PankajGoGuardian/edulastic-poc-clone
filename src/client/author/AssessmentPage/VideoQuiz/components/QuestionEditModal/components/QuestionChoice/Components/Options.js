import React, { memo } from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import Option from './Option'

const Options = ({ options, correctAnswers = [], ...restProps }) => {
  return (
    <div>
      {options.map((option, index) => {
        const isSelected = correctAnswers.includes(option.value)
        return (
          <Option
            key={option.value}
            index={index}
            optionIdx={index}
            option={option}
            isSelected={isSelected}
            {...restProps}
          />
        )
      })}
    </div>
  )
}

const SortableOptions = SortableContainer(Options)
export default memo(SortableOptions)
