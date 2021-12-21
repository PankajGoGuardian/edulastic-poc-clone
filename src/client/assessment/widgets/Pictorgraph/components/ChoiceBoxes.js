import React, { Fragment } from 'react'
import { get } from 'lodash'
import styled from 'styled-components'

import { DragDrop, FlexContainer, Subtitle } from '@edulastic/common'

import ChoiceContainer from './ChoiceContainer'
import DragItem from './DragItem'
import { Separator } from '../styled/Separator'
import { getStemNumeration } from '../../../utils/helpers'
import { BorderedContainer } from './ClickToSelect/styled'
import { AnswerBox } from './DragItem/styled/AnswerBox'

const ChoiceBoxes = ({
  t,
  item,
  onDrop,
  direction,
  isVertical,
  stemNumeration,
  dragItemProps,
  dragItemMaxWidth,
  disableResponse,
  isAnswerModifiable,
  possibleResponses,
  verifiedDragItems,
  possibleResponseGroups,
  groupPossibleResponses,
  verifiedGroupDragItems,
  isQuestionLayer,
  onClick,
}) => {
  const onDropHandler = ({ data }) => {
    onDrop(data, { flag: 'dragItems' })
  }

  const isClickToSelect =
    item.answeringStyle === 'clickToSelect' && !isQuestionLayer

  const handleClick = (id) => () => {
    onClick(id)
  }

  return (
    <ChoiceContainer
      direction={direction}
      choiceWidth={dragItemMaxWidth}
      title={
        isClickToSelect
          ? t('component.pictograph.clickToSelect')
          : t('component.classification.dragItemsTitle')
      }
    >
      {isClickToSelect && (
        <BorderedContainer
          borderStyle="dashed"
          borderWidth="3px"
          alignItems="center"
          padding="10px"
        >
          {verifiedDragItems.map(({ id, image, unit, count }) => (
            <BorderedContainer
              backgroundColor="white"
              key={id}
              alignItems="center"
              padding="10px"
              cursor="pointer"
              onClick={handleClick(id)}
            >
              <FlexContainer
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <AnswerBox dangerouslySetInnerHTML={{ __html: image }} />
                <span>
                  {count} {unit}
                </span>
              </FlexContainer>
            </BorderedContainer>
          ))}
        </BorderedContainer>
      )}
      {!isClickToSelect && (
        <DropContainer drop={onDropHandler} isVertical={isVertical}>
          <FlexContainer
            style={{ width: '100%' }}
            flexDirection="column"
            alignItems="stretch"
            justifyContent="center"
            maxWidth="100%"
          >
            {groupPossibleResponses ? (
              verifiedGroupDragItems.map((i, index) => (
                <Fragment key={index}>
                  <FlexContainer
                    style={{ flex: 1 }}
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    maxWidth="100%"
                  >
                    <Subtitle>
                      {get(item, `possibleResponseGroups[${index}].title`, '')}
                    </Subtitle>
                    <FlexContainer className="choice-items-wrapper">
                      {i.map((ite, ind) => (
                        <DragItem
                          {...dragItemProps}
                          renderIndex={getStemNumeration(stemNumeration, ind)}
                          item={ite}
                          key={ite.id}
                        />
                      ))}
                    </FlexContainer>
                  </FlexContainer>
                  {index !== possibleResponseGroups.length - 1 && <Separator />}
                </Fragment>
              ))
            ) : (
              <>
                <FlexContainer
                  style={{ flex: 1 }}
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="flex-start"
                  maxWidth="100%"
                >
                  <FlexContainer className="choice-items-wrapper">
                    {verifiedDragItems.map((ite) => (
                      <DragItem
                        {...dragItemProps}
                        key={ite?.id}
                        item={ite}
                        renderIndex={possibleResponses.indexOf(ite)}
                        disableResponse={disableResponse || !isAnswerModifiable}
                      />
                    ))}
                  </FlexContainer>
                </FlexContainer>
              </>
            )}
          </FlexContainer>
        </DropContainer>
      )}
    </ChoiceContainer>
  )
}

export default ChoiceBoxes

const DropContainer = styled(DragDrop.DropContainer)`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: ${({ isVertical }) => (isVertical ? '140px' : '50px')};
  border-radius: 4px;
`
