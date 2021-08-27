import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import produce from 'immer'
import { withTheme } from 'styled-components'

import {
  CenteredText,
  MathFormulaDisplay,
  QuestionContext,
} from '@edulastic/common'
import { lightGrey12 } from '@edulastic/colors'

import DragItem from './DragItem'
import { DropContainer, ColumnHeader, ColumnLabel } from '../styled/Column'
import { Rnd } from '../styled/RndWrapper'
import { RowTitleCol } from '../styled/RowTitleCol'
import ResponseRnd from '../ResponseRnd'
import { EDIT } from '../../../constants/constantsForQuestions'
import ClickToSelect from './ClickToSelect'

const TableRow = ({
  colCount,
  rowTitles,
  answers,
  preview,
  onDrop,
  evaluation,
  dragHandle,
  isTransparent,
  isBackgroundImageTransparent,
  height,
  isResizable,
  item,
  isReviewTab,
  view,
  setQuestionData,
  rowHeader,
  dragItemSize,
  droppedChoices,
  showClassName,
  isQuestionLayer,
  theme,
}) => {
  const { questionId } = useContext(QuestionContext)

  const handleRowTitleDragStop = (event, data) => {
    if (setQuestionData) {
      setQuestionData(
        produce(item, (draft) => {
          draft.rowTitle = {
            x: data.x < 0 ? 0 : data.x,
            y: data.y < 0 ? 0 : data.y,
          }
        })
      )
    }
  }

  const evaluationHighlights = useMemo(() => {
    return (item?.classifications || []).reduce((acc, { id }) => {
      let color
      const evaluationResult = evaluation?.[id]
      switch (evaluationResult) {
        case 'all':
          color = theme.widgets.classification.dragItemValidBgColor
          break
        case 'partial':
          color = theme.common.partiallyCorrectScoreBlockBgColor
          break
        case 'none':
          color = theme.widgets.classification.dragItemNotValidBgColor
          break
        default:
          break
      }
      acc[id] = color

      return acc
    }, {})
  }, [evaluation, item])

  const handleRowHeaderDragStop = (e, d) => {
    if (setQuestionData) {
      setQuestionData(
        produce(item, (draft) => {
          draft.rowHeaderPos = { x: d.x < 0 ? 0 : d.x, y: d.y < 0 ? 0 : d.y }
        })
      )
    }
  }

  const onDropHandler = (flag, columnId) => ({ data }) => {
    onDrop(data, { columnId, flag })
  }

  const cols = []
  const rndX = get(item, `rowTitle.x`, 0)
  const rndY = get(item, `rowTitle.y`, rowHeader ? 40 : 0)

  const rowHeaderX = get(item, `rowHeaderPos.x`, 0)
  const rowHeaderY = get(item, `rowHeaderPos.y`, 0)

  const responses = item.groupPossibleResponses
    ? item.possibleResponseGroups.flatMap((group) => group.responses)
    : item.possibleResponses

  if (rowHeader) {
    cols.push(
      <Rnd
        position={{ x: rowHeaderX, y: rowHeaderY }}
        disableDragging={view !== EDIT}
        onDragStop={handleRowHeaderDragStop}
      >
        <RowTitleCol
          colCount={colCount}
          justifyContent="center"
          width="100%"
          padding="0"
          marginTop="0"
          data-cy="rowHeader"
        >
          <CenteredText
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              wordWrap: 'break-word',
              width: 200,
              minHeight: 39,
            }}
            dangerouslySetInnerHTML={{ __html: rowHeader }}
          />
        </RowTitleCol>
      </Rnd>
    )
  }

  const columns = item.classifications?.length || 0

  for (let index = 0; index < columns; index++) {
    const hasRowTitle = rowTitles.length > 0
    if (hasRowTitle && rowTitles[index]?.trim() !== '') {
      cols.push(
        <Rnd
          position={{ x: rndX, y: rndY }}
          disableDragging={view !== EDIT}
          onDragStop={handleRowTitleDragStop}
        >
          <RowTitleCol
            key={index + columns}
            justifyContent="center"
            width="100%"
            data-cy="rowTitle"
          >
            <MathFormulaDisplay
              style={{
                display: 'flex',
                alignItems: 'baseline',
                wordWrap: 'break-word',
                width: get(item, 'uiStyle.rowTitlesWidth', '100px'),
                height: get(item, 'uiStyle.rowMinHeight', 'auto'),
              }}
              dangerouslySetInnerHTML={{ __html: rowTitles[index] }}
            />
          </RowTitleCol>
        </Rnd>
      )
    }
    const column = item.classifications?.[index] || {}
    const hasAnswer =
      Array.isArray(answers?.[column.id]) && answers[column.id].length > 0

    // -40 is column header height
    const colHeight = get(column, 'height', parseInt(height, 10)) - 40

    cols.push(
      <ResponseRnd
        hasRowTitle={hasRowTitle}
        question={item}
        index={index}
        isResizable={isResizable}
        columnId={column.id}
        {...dragItemSize}
      >
        {showClassName && (
          <ColumnHeader>
            <ColumnLabel
              dangerouslySetInnerHTML={{ __html: column.name || '' }}
            />
          </ColumnHeader>
        )}
        <DropContainer
          evaluationBackgroundColor={evaluationHighlights[column.id]}
          index={index}
          height={`${colHeight}px`}
          borderColor={lightGrey12}
          isTransparent={isBackgroundImageTransparent}
          drop={onDropHandler(
            'column',
            item.classifications?.[index]?.id || ''
          )}
        >
          {droppedChoices &&
            droppedChoices[column.id]?.map(
              ({ id: responseId }, answerIndex) => {
                const resp =
                  (responses.length &&
                    responses.find((_resp) => _resp.id === responseId)) ||
                  {}
                const valid = get(
                  evaluation,
                  [column.id, responseId],
                  undefined
                )
                return (
                  <DragItem
                    key={resp?.id + answerIndex}
                    isTransparent={isTransparent}
                    dragHandle={dragHandle}
                    valid={isReviewTab ? true : valid}
                    preview={preview}
                    noPadding
                    {...dragItemSize}
                    from="column"
                    item={resp}
                    fromColumnId={column.id}
                    disableDrag
                  />
                )
              }
            )}
          {hasAnswer &&
            answers[column.id]?.map(({ id: responseId }, answerIndex) => {
              const resp =
                (responses.length &&
                  responses.find((_resp) => _resp.id === responseId)) ||
                {}
              const valid = get(evaluation, [column.id, responseId], undefined)
              return (
                <DragItem
                  key={resp?.id + answerIndex}
                  isTransparent={isTransparent}
                  dragHandle={dragHandle}
                  valid={isReviewTab ? true : valid}
                  preview={preview}
                  noPadding
                  {...dragItemSize}
                  from="column"
                  item={resp}
                  fromColumnId={column.id}
                />
              )
            })}
        </DropContainer>
      </ResponseRnd>
    )
  }

  return (
    <div
      className={`classification-cols-container-${questionId}`}
      style={{ position: 'relative', minHeight: 140 }}
    >
      {item.answeringStyle === 'clickToSelect' && !isQuestionLayer && (
        <ClickToSelect
          classifications={item.classifications}
          droppedChoices={droppedChoices}
          possibleResponses={item.possibleResponses}
          showClassName={showClassName}
          elementContainers={item.elementContainers}
          answers={answers}
          evaluationHighlights={evaluationHighlights}
        />
      )}
      {(item.answeringStyle !== 'clickToSelect' || isQuestionLayer) && cols}
    </div>
  )
}

TableRow.propTypes = {
  height: PropTypes.any.isRequired,
  colCount: PropTypes.number.isRequired,
  dragHandle: PropTypes.any.isRequired,
  colTitles: PropTypes.array.isRequired,
  rowTitles: PropTypes.array.isRequired,
  isTransparent: PropTypes.any.isRequired,
  isBackgroundImageTransparent: PropTypes.any.isRequired,
  answers: PropTypes.array.isRequired,
  preview: PropTypes.bool.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  evaluation: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  isReviewTab: PropTypes.bool.isRequired,
  isResizable: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  rowHeader: PropTypes.string,
  dragItemSize: PropTypes.object.isRequired,
}

TableRow.defaultProps = {
  rowHeader: null,
}

export default withTheme(TableRow)
