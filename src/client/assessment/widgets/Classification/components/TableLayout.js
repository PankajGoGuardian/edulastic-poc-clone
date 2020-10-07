import React from 'react'
import { lightGrey12 } from '@edulastic/colors'
import { CenteredText, DragDrop } from '@edulastic/common'
import styled from 'styled-components'
import { get, groupBy } from 'lodash'
import { Table, TH, TD, TR } from '../styled/TableLayout'

import DragItem from './DragItem'

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
  minWidth,
  disableResponse,
  rowHeader = '',
  dragItemSize = {},
}) => {
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

  for (let index = 0; index < colCount; index++) {
    columnTitles.push(
      <TH colSpan={2} minWidth={minWidth}>
        <CenteredText
          wordWrap="break-word"
          dangerouslySetInnerHTML={{ __html: colTitles[index] }}
        />
      </TH>
    )
  }

  const rows = []

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const arr = []
    arr.push(
      <TD center>
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
          <DropContainer
            drop={onDropHandler('column', column.id)}
            index={validIndex}
            borderColor={lightGrey12}
          >
            <ColumnContainer
              height={height}
              width={minWidth}
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
                      item={(resp && resp.value) || ''}
                      disableResponse={disableResponse}
                      {...dragItemSize}
                      isResetOffset
                      from="column"
                      fromColumnId={column.id}
                    />
                  )
                })}
            </ColumnContainer>
          </DropContainer>
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
`

const ColumnContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  position: relative;
  flex-direction: column;
  min-height: ${({ height }) => height};
  min-width: ${({ width }) => width};
  width: 100%;
  height: 100%;
  background-color: ${({ isTransparent, theme }) =>
    isTransparent
      ? 'transparent'
      : theme.widgets.classification.dropContainerBgColor};
`
