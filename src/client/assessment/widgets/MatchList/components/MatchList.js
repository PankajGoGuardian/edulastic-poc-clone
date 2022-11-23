import React, { useMemo } from 'react'
import { FlexContainer, DragDrop } from '@edulastic/common'
import ListItemContainer from './ListItemContainer'
import { AnswerItem } from '../styled/AnswerItem'
import { Separator } from '../styled/Separator'
import { getStemNumeration } from '../../../utils/helpers'
import { SHOW } from '../../../constants/constantsForQuestions'
import DragItem from './DragItem'

const { DropContainer } = DragDrop

const MatchList = ({
  ans,
  list,
  onDrop,
  getStyles,
  allItemsById,
  showEvaluate,
  evaluation,
  smallSize,
  changePreviewTab,
  listPosition,
  isPrintPreview,
  stemNumeration,
  disableResponse,
  previewTab,
  isAnswerModifiable,
  hideEvaluation,
}) => {
  const onDropHandler = ({ data }, index) => {
    onDrop(data, { flag: 'ans', index })
  }

  const [
    responseBoxStyle,
    stemColStyle,
    choiceColStyle,
    listItemContainerStyle,
  ] = useMemo(() => {
    const horizontallyAligned =
      listPosition === 'left' || listPosition === 'right'
    const boxStyle = {
      marginRight: listPosition === 'right' ? 20 : 0,
      marginLeft: listPosition === 'left' ? 20 : 0,
      marginTop: horizontallyAligned ? 14 : 0,
      width: isPrintPreview ? '100%' : horizontallyAligned ? null : 750,
      flex: horizontallyAligned ? 'auto' : null,
    }
    const _stemColStyle = {
      alignSelf: 'stretch',
      width: `calc(50% - ${smallSize ? 28 : 40}px)`,
    }
    if (isPrintPreview) {
      _stemColStyle.maxWidth = _stemColStyle.width
      _stemColStyle.width = '100%'
    }
    const _choiceColStyle = {
      borderRadius: 2,
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center',
      alignSelf: 'stretch',
      minHeight: smallSize ? 26 : 32,
      width: `calc(50% - ${smallSize ? 28 : 40}px)`,
      maxWidth: '50%',
      padding: 0,
    }
    const _listItemContainerStyle = {
      width: '100%',
      marginBottom: 6,
      marginTop: 6,
    }
    return [boxStyle, _stemColStyle, _choiceColStyle, _listItemContainerStyle]
  }, [listPosition, isPrintPreview, smallSize])

  return (
    <FlexContainer
      style={responseBoxStyle}
      flexDirection="column"
      alignItems="flex-start"
    >
      {list.map(({ value = '', label = '' }, i) => {
        const item = ans[list[i].value] && allItemsById[ans[list[i].value]]
        return (
          <div
            key={i}
            className="__prevent-page-break"
            style={{ width: '100%' }}
            data-cy="listItem"
          >
            <AnswerItem
              key={i}
              style={listItemContainerStyle}
              alignItems="center"
              childMarginRight={smallSize ? 13 : 45}
            >
              <ListItemContainer
                key={value}
                smallSize={smallSize}
                stemColStyle={stemColStyle}
                label={label}
              />
              <Separator smallSize={smallSize} />
              <DropContainer
                index={i}
                noBorder={
                  showEvaluate && !!ans[list[i].value] && !hideEvaluation
                }
                drop={onDropHandler}
                style={choiceColStyle}
              >
                {item && (
                  <DragItem
                    flag="ans"
                    centerContent
                    renderIndex={i}
                    item={
                      (ans[list[i].value] &&
                        allItemsById[ans[list[i].value]]) ||
                      null
                    }
                    displayIndex={getStemNumeration(stemNumeration, i)}
                    getStyles={getStyles}
                    preview={showEvaluate}
                    correct={evaluation[list[i].value]}
                    disableResponse={disableResponse || !isAnswerModifiable}
                    showAnswer={previewTab === SHOW}
                    changePreviewTab={changePreviewTab}
                    width="100%"
                    flex={1}
                  />
                )}
              </DropContainer>
            </AnswerItem>
          </div>
        )
      })}
    </FlexContainer>
  )
}

export default MatchList
