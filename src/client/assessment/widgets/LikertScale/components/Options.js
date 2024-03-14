import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { FlexContainer } from '@edulastic/common'
import { SortableContainer } from 'react-sortable-hoc'
import OptionComponent from './Option'

const Options = ({ options, ...restProps }) => {
  return (
    <FlexContainer
      justifyContent="left"
      flexDirection="column"
      className="__prevent-page-break __print-space-reduce-options"
    >
      {options.map((option, index) => (
        <OptionComponent
          key={option.value}
          index={index}
          idx={index}
          option={option}
          {...restProps}
        />
      ))}
    </FlexContainer>
  )
}

Options.propTypes = {
  options: PropTypes.array.isRequired,
  onChangeOption: PropTypes.func.isRequired,
  onRemoveOption: PropTypes.func.isRequired,
  sortOptions: PropTypes.func.isRequired,
  scaleType: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  handleSaveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.string,
}

Options.defaultProps = {
  userAnswer: '',
}

const SortableOptions = SortableContainer(Options)
export default memo(SortableOptions)
