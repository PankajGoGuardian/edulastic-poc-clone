import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
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
    const numOfColumns = parseInt(uiStyle.columns || 1, 10)
    const numOfRows = Math.ceil(options.length / numOfColumns)
    const tempRows = new Array(numOfRows).fill(true)
    return new Array(numOfColumns).fill(true).map((_, c) => {
      return tempRows
        .map((__, r) => {
          const optIndex =
            uiStyle.orientation === 'horizontal'
              ? numOfColumns * r + c
              : numOfRows * c + r
          return options[optIndex]
        })
        .filter((x) => x)
    })
  }, [options, uiStyle.orientation, uiStyle.columns])

  return (
    <OptionsList
      width="100%"
      styleType={styleType}
      fontSize={fontSize}
      className="multiplechoice-optionlist"
      uiStyleType={uiStyle?.type}
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
              // maxWidth={`${(1 / numOfCols) * 100 - 1}%`}
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
