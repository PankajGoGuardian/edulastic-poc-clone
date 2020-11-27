import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  SortableContainer,
  SortableHandle,
  SortableElement,
} from 'react-sortable-hoc'
import { IconPlus, IconMinusRounded } from '@edulastic/icons'
import { EduButton } from '@edulastic/common'
import { first, last } from 'lodash'
import { greyThemeLight } from '@edulastic/colors'
import SingleItem from './SingleItem'
import { DragHandleComponent } from './DragHandle'
import { DragCrad } from '../styled'

const DragHandle = SortableHandle(DragHandleComponent)

const GroupItems = SortableContainer((props) => {
  // items is always an array of passage items
  const { items, isEditable } = props
  const [localItems, setLocalItems] = useState([])
  const [minimize, setMinimize] = useState(true)

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
    <GroupItemsContainer>
      <DragCrad noPadding={!minimize} data-cy="group-drag-card">
        {minimize && <DragHandle indx={indexStr} isEditable={isEditable} />}
        <div className="group-items">
          {localItems.map((ite, index) => (
            <SingleItem
              key={ite._id}
              {...props}
              item={ite}
              index={index}
              hideHanlde={minimize}
              disabled={minimize}
            />
          ))}
        </div>
      </DragCrad>

      <GroupLine minimize={minimize}>
        <PlusButton
          isBlue
          noBorder
          IconBtn
          ml="0px"
          onClick={toggleMinizeGroup}
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
    width: 100%;
  }
`

const PlusButton = styled(EduButton)`
  width: 18px;
  height: 18px;
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
  top: 2.6em;
  left: 9px;
  bottom: 5.2em;
  border-right: 0px;
  border-radius: 4px 0px 0px 4px;
`
