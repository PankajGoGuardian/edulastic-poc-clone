import React, { useMemo } from 'react'
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
  const noOfColumns = uiStyle.columns || 1
  const noOfRows = Math.ceil(options.length / noOfColumns)
  const updateArrangement = (arr) => {
    const res = []
    let colPtr = 1
    let rowPtr = 0
    let index = 0
    const delta = noOfRows * noOfColumns - arr.length
    let count = 0
    while (count < arr.length) {
      res.push(arr[index])
      // eslint-disable-next-line no-unused-expressions
      colPtr > noOfColumns - delta && noOfColumns - delta !== 0
        ? (index += noOfRows - 1)
        : (index += noOfRows)
      ++colPtr
      if (index >= arr.length) {
        index = ++rowPtr
        colPtr = 1
      }
      count++
    }
    return res
  }

  const mcqOptions =
    uiStyle.orientation !== 'vertical' ? options : updateArrangement(options)

  const OptComponent = fromSetAnswers ? SortableOption : Option

  const indexMap = useMemo(
    () =>
      mcqOptions.reduce((acc, curr, i) => {
        acc[curr.value] = i
        return acc
      }, {}),
    [mcqOptions]
  )

  const cols = chunk(mcqOptions, noOfRows)

  return (
    <OptionsList
      width={fromSetAnswers && '100%'}
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
