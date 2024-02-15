import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  SortableContainer,
  SortableHandle,
  SortableElement,
} from 'react-sortable-hoc'
import { IconPlus, IconMinusRounded } from '@edulastic/icons'
import { EduButton, helpers } from '@edulastic/common'
import { first, last } from 'lodash'
import { greyThemeLight } from '@edulastic/colors'
import SingleItem from './SingleItem'
import { DragHandleComponent } from './DragHandle'
import { DragCrad } from '../styled'

const DragHandle = SortableHandle(DragHandleComponent)

const GroupItems = SortableContainer((props) => {
  // items is always an array of passage items
  const { items, isEditable, scoring, groupId, showGroupsPanel, setShowAutoSelectScoreChangeModal } = props
  const [localItems, setLocalItems] = useState([])
  const [minimize, setMinimize] = useState(true)

  const groupPoints = items.reduce(
    (acc, curr) =>
      acc +
      (curr.isLimitedDeliveryType
        ? 1
        : scoring[curr._id] || helpers.getPoints(curr)),
    0
  )

  const toggleMinizeGroup = () => {
    setMinimize(!minimize)
  }

  useEffect(() => {
    if (minimize) {
      setLocalItems([first(items)])
    } else {
      setLocalItems(items)
    }
  }, [minimize, items])

  const indexStr = useMemo(() => {
    const firstItem = first(items)
    const lastItem = last(items)
    return `${firstItem.indx}-${lastItem.indx}`
  }, [minimize, items])

  return (
    <GroupItemsContainer minimize={minimize}>
      <DragCrad noPadding={!minimize} data-cy="group-drag-card">
        {minimize && <DragHandle indx={indexStr} isEditable={isEditable} />}
        <div className="group-items">
          {localItems.map((ite, index) => {
            if (showGroupsPanel && groupId && groupId !== ite.groupId) {
              return null
            }
            return (
              <SingleItem
                key={ite._id}
                {...props}
                item={ite}
                index={index}
                groupPoints={groupPoints}
                groupMinimized={minimize}
                hideHanlde={minimize}
                disabled={minimize}
                setShowAutoSelectScoreChangeModal={setShowAutoSelectScoreChangeModal}
              />
            )
          })}
        </div>
      </DragCrad>

      <GroupLine minimize={minimize}>
        <PlusButton
          isBlue
          noBorder
          IconBtn
          ml="0px"
          onClick={toggleMinizeGroup}
          dataCy={minimize ? 'iconPlus' : 'iconMinus'}
        >
          {minimize ? <IconPlus /> : <IconMinusRounded />}
        </PlusButton>
      </GroupLine>
    </GroupItemsContainer>
  )
})
export default SortableElement(GroupItems)

const GroupItemsContainer = styled.div`
  position: relative;

  & .group-items {
    flex-shrink: 0;
    width: ${({ minimize }) => (minimize ? 'calc(100% - 30px)' : '100%')};
  }
`

const PlusButton = styled(EduButton)`
  width: 18px !important;
  height: 18px !important;
  top: 50%;
  border-radius: 50%;
  position: absolute;
  left: -9px;
  transform: translateY(-50%);

  svg {
    width: 10px;
    height: 10px;
    margin: 0px;
  }
`

const GroupLine = styled.div`
  width: ${({ minimize }) => !minimize && '12px'};
  border: ${({ minimize }) => !minimize && '1px solid'};
  border-color: ${greyThemeLight};
  position: absolute;
  top: 2em;
  left: 9px;
  bottom: 4.9em;
  border-right: 0px;
  border-radius: 4px 0px 0px 4px;
`
