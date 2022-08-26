import React from 'react'
import { Input } from 'antd'
import { test as testConstants } from '@edulastic/constants'
import { lightRed2 } from '@edulastic/colors'
import { ItemCountWrapper } from './styled'

const { ITEM_GROUP_TYPES, ITEM_GROUP_DELIVERY_TYPES } = testConstants

export default function ItemCountWrapperContainer({
  handleChange,
  currentGroupDetails,
  currentGroupIndex,
  index,
  itemGroup,
  isRequired,
}) {
  return (
    <ItemCountWrapper>
      <span>Deliver a total of </span>
      <Input
        data-cy={`input-deliver-bycount-${itemGroup.groupName}`}
        type="number"
        disabled={
          (currentGroupDetails?.deliveryType ===
            ITEM_GROUP_DELIVERY_TYPES.ALL &&
            currentGroupIndex === index) ||
          currentGroupIndex !== index
        }
        min={0}
        value={
          currentGroupIndex === index
            ? currentGroupDetails.deliverItemsCount || ''
            : itemGroup.deliverItemsCount || ''
        }
        onChange={(e) =>
          handleChange('deliverItemsCount', parseFloat(e.target.value))
        }
        max={
          currentGroupDetails.type === ITEM_GROUP_TYPES.STATIC
            ? itemGroup.items.length
            : 100
        }
      />
      <span>
        Item(s) {isRequired ? <span style={{ color: lightRed2 }}>*</span> : ''}
      </span>
    </ItemCountWrapper>
  )
}
