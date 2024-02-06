import React from 'react'
import { Input } from 'antd'
import { test as testConstants } from '@edulastic/constants'
import { ItemCountWrapper } from './styled'

const { ITEM_GROUP_DELIVERY_TYPES } = testConstants

export default function PickItemCountWrapperContainer({
  handleChange,
  currentGroupDetails,
  currentGroupIndex,
  index,
  itemGroup,
}) {
  // const correctDeliveryType = (
  //   currentGroupIndex === index ?
  //   currentGroupDetails?.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM :
  //   itemGroup?.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
  // )

  const disabled =
    (currentGroupDetails?.deliveryType ===
      ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM &&
      currentGroupIndex === index) ||
    currentGroupIndex !== index
  return (
    <ItemCountWrapper>
      <span>Pick </span>
      <Input
        type="number"
        disabled={disabled}
        min={1}
        max={100}
        value={
          currentGroupIndex === index
            ? currentGroupDetails?.items?.length ||
              currentGroupDetails?.autoSelectItemsCount ||
              1
            : itemGroup?.items?.length || itemGroup?.autoSelectItemsCount || 1
        }
        onChange={(e) =>
          handleChange('autoSelectItemsCount', parseInt(e.target.value, 10))
        }
      />
      <span>item(s) and deliver</span>
      <Input
        type="number"
        disabled={disabled}
        value={
          currentGroupIndex === index
            ? currentGroupDetails?.deliverItemsCount || 1
            : itemGroup?.deliverItemsCount || 1
        }
        min={1}
        max={
          currentGroupIndex === index
            ? currentGroupDetails?.autoSelectItemsCount || 100
            : itemGroup?.autoSelectItemsCount || 100
        }
        onChange={(e) =>
          handleChange('deliverItemsCount', parseInt(e.target.value, 10))
        }
      />
      <span>random items per student with</span>
      <Input
        type="number"
        disabled={disabled}
        min={1}
        value={
          currentGroupIndex === index
            ? currentGroupDetails?.itemsDefaultMaxScore || 1
            : itemGroup?.itemsDefaultMaxScore || 1
        }
        onChange={(e) =>
          handleChange('itemsDefaultMaxScore', parseInt(e.target.value, 10))
        }
      />
      <span>points for each question</span>
    </ItemCountWrapper>
  )
}
