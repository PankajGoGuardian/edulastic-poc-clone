import React from 'react'
import { Input } from 'antd'
import { test as testConstants } from '@edulastic/constants'
import { ItemCountWrapper } from './styled'

const { ITEM_GROUP_TYPES, ITEM_GROUP_DELIVERY_TYPES } = testConstants

export default function ItemCountWrapperContainer({
  handleChange,
  editGroupDetail,
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
          (editGroupDetail.deliveryType === ITEM_GROUP_DELIVERY_TYPES.ALL &&
            currentGroupIndex === index) ||
          currentGroupIndex !== index
        }
        min={0}
        value={
          currentGroupIndex === index
            ? editGroupDetail.deliverItemsCount || ''
            : itemGroup.deliverItemsCount || ''
        }
        onChange={(e) =>
          handleChange('deliverItemsCount', parseFloat(e.target.value))
        }
        max={
          editGroupDetail.type === ITEM_GROUP_TYPES.STATIC
            ? itemGroup.items.length
            : 100
        }
      />
      <span> Item(s) {isRequired ? '*' : ''}</span>
    </ItemCountWrapper>
  )
}
