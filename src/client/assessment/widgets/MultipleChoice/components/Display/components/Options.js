import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { chunk } from 'lodash'
import { SortableContainer } from 'react-sortable-hoc'
import { FlexContainer } from '@edulastic/common'
import { OptionsList } from '../styled/OptionsList'
import Option, { SortableOption } from './Option'

const Options = ({
  options,
  evaluation,
  uiStyle,
  onChange,
  onRemove,
  validation,
  styleType,
  multipleResponses,
  fontSize,
  item,
  fromSetAnswers,
  ...restProps
}) => {
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0)
  const noOfColumns = parseInt(uiStyle.columns || 1, 10)
  const noOfRows = Math.ceil(options.length / noOfColumns)

  const OptComponent = fromSetAnswers ? SortableOption : Option

  const indexMap = useMemo(
    () =>
      options.reduce((acc, curr, i) => {
        acc[curr.value] = i
        return acc
      }, {}),
    [options]
  )
  const cols = useMemo(() => {
    if (uiStyle.orientation === 'horizontal') {
      const bump = chunk(options, noOfColumns)
      return new Array(noOfRows)
        .fill(true)
        .map((_, i) => {
          if (noOfColumns > i) {
            return bump.map((col) => col[i]).filter((x) => x)
          }
          return null
        })
        .filter((x) => x)
    }
    return chunk(options, noOfRows)
  }, [options, noOfColumns, noOfRows, uiStyle.orientation])

  return (
    <OptionsList
      width="100%"
      styleType={styleType}
      fontSize={fontSize}
      className="multiplechoice-optionlist"
    >
      {cols.map((col, colIdx) => (
        <FlexContainer
          key={colIdx}
          width={`calc(${100 / cols.length}% - 15px)`}
          justifyContent="left"
          flexDirection="column"
          className="__prevent-page-break __print-space-reduce-options"
          data-cy="sortable-list-container"
        >
          {col.map((row) => (
            <OptComponent
              maxWidth={`${(1 / noOfColumns) * 100 - 1}%`}
              key={row.value}
              indx={indexMap[row.value]}
              index={indexMap[row.value]}
              uiStyle={uiStyle}
              item={row}
              validation={validation}
              onChange={() => onChange(row.value)}
              onRemove={() => onRemove(row.value)}
              correct={evaluation}
              styleType={styleType}
              multipleResponses={multipleResponses}
              fontSize={fontSize}
              fromSetAnswers={fromSetAnswers}
              setFocusedOptionIndex={setFocusedOptionIndex}
              focusedOptionIndex={focusedOptionIndex}
              {...restProps}
            />
          ))}
        </FlexContainer>
      ))}
    </OptionsList>
  )
}
export const SortableOptions = SortableContainer(Options)

Options.propTypes = {
  showAnswer: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  validation: PropTypes.object,
  options: PropTypes.array,
  smallSize: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object.isRequired,
  evaluation: PropTypes.any.isRequired,
  styleType: PropTypes.string,
  multipleResponses: PropTypes.bool,
}

Options.defaultProps = {
  showAnswer: false,
  checkAnswer: false,
  userSelections: [],
  validation: {},
  options: [],
  multipleResponses: false,
  smallSize: false,
  styleType: 'default',
}

export default React.memo(Options)
