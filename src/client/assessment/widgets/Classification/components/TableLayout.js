import React from 'react'
import { lightGrey12 } from '@edulastic/colors'
import { CenteredText, DragDrop, FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import { get, groupBy } from 'lodash'
import { Table, TH, TD, TR } from '../styled/TableLayout'

import DragItem from './DragItem'
import { ColumnHeader, ColumnLabel } from '../styled/Column'

const TableLayout = ({
  rowCount,
  rowTitles,
  colCount,
  colTitles,
  dragHandle,
  isBackgroundImageTransparent,
  isTransparent,
  height,
  answers,
  item,
  isReviewTab,
  evaluation,
  preview,
  onDrop,
  disableResponse,
  rowHeader = '',
  dragItemSize = {},
}) => {
  const { maxWidth, minWidth, minHeight, maxHeight, width } = dragItemSize
  const classifications = get(item, ['classifications'], [])
  const classificationsGrouped = groupBy(classifications, (obj) => obj.rowIndex)
  let validIndex = -1
  const responses = item.groupPossibleResponses
    ? item.possibleResponseGroups.flatMap((group) => group.responses)
    : item.possibleResponses
  const columnTitles = []

  const onDropHandler = (flag, columnId) => ({ data }) => {
    onDrop(data, { columnId, flag })
  }

  const rows = []

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const arr = []
    arr.push(
      // marginTop is column height title
      <TD center marginTop={rowIndex === 0 ? '48px' : ''}>
        <CenteredText
          wordWrap="break-word"
          dangerouslySetInnerHTML={{ __html: rowTitles[rowIndex] }}
        />
      </TD>
    )
    for (let columnIndex = 0; columnIndex < colCount; columnIndex++) {
      validIndex++
      const column = classificationsGrouped?.[rowIndex]?.[columnIndex] || {}
      const hasAnswer =
        Array.isArray(answers[column.id]) && answers[column.id].length > 0
      arr.push(
        <TD>
          <FlexContainer flexDirection="column">
            {rowIndex === 0 && colTitles[columnIndex] && (
              <ColumnHeader>
                <ColumnLabel
                  dangerouslySetInnerHTML={{ __html: colTitles[columnIndex] }}
                />
              </ColumnHeader>
            )}
            <DropContainer
              maxWidth={maxWidth}
              minWidth={minWidth}
              minHeight={minHeight}
              maxHeight={maxHeight}
              width={width + 24} // margin+padding+border
              drop={onDropHandler('column', column.id)}
              index={validIndex}
              borderColor={lightGrey12}
            >
              <ColumnContainer
                minHeight={height}
                minWidth={`${minWidth}px`}
                isTransparent={isBackgroundImageTransparent}
              >
                {hasAnswer &&
                  answers[column.id].map((responseId, answerIndex) => {
                    const resp = responses.find((res) => res.id === responseId)
                    const valid = get(
                      evaluation,
                      [column.id, responseId],
                      undefined
                    )
                    return (
                      <DragItem
                        isTransparent={isTransparent}
                        dragHandle={dragHandle}
                        valid={isReviewTab ? true : valid}
                        preview={preview}
                        key={resp?.id || answerIndex}
                        item={resp}
                        disableResponse={disableResponse}
                        maxWidth={maxWidth}
                        minWidth={minWidth}
                        minHeight={minHeight}
                        maxHeight={maxHeight}
                        width={width}
                        isResetOffset
                        from="column"
                        fromColumnId={column.id}
                      />
                    )
                  })}
              </ColumnContainer>
            </DropContainer>
          </FlexContainer>
        </TD>
      )
    }
    rows.push(<TR className="table-layout">{arr}</TR>)
  }

  return (
    <Table>
      <TR className="table-layout">
        <TH>
          <CenteredText
            style={{ wordWrap: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: rowHeader }}
          />
        </TH>
        {columnTitles}
      </TR>
      {rows}
    </Table>
  )
}

export default TableLayout

const DropContainer = styled(DragDrop.DropContainer)`
  display: flex;
  border-radius: 4px;
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  min-width: ${({ minWidth }) => `${minWidth}px`};
  max-height: ${({ maxHeight }) => `${maxHeight}px`};
  min-height: ${({ minHeight }) => `${minHeight}px`};
  width: ${({ width }) => `${width}px`};
`

const ColumnContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  position: relative;
  flex-direction: column;
  min-height: ${({ minHeight }) => minHeight};
  min-width: ${({ minWidth }) => minWidth};
  width: 100%;
  height: 100%;
  background-color: ${({ isTransparent, theme }) =>
    isTransparent
      ? 'transparent'
      : theme.widgets.classification.dropContainerBgColor};
`
