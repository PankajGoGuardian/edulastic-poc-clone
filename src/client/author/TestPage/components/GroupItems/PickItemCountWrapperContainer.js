import React from 'react'
import { Input } from 'antd'
import { test as testConstants } from '@edulastic/constants'
import { ItemCountWrapper } from './styled'

const { ITEM_GROUP_DELIVERY_TYPES } = testConstants

const isInputFieldsDisabled = (
  currentGroupDetails,
  currentGroupIndex,
  index
) => {
  if (currentGroupIndex !== index) {
    return true
  }
  if (
    currentGroupDetails?.deliveryType === ITEM_GROUP_DELIVERY_TYPES.ALL_RANDOM
  ) {
    return true
  }
  return false
}

export default function PickItemCountWrapperContainer({
  handleChange,
  currentGroupDetails,
  currentGroupIndex,
  index,
  itemGroup,
}) {
  const relevantGroup =
    currentGroupIndex === index ? currentGroupDetails : itemGroup
  const showValue =
    relevantGroup?.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
  const disabled = isInputFieldsDisabled(
    currentGroupDetails,
    currentGroupIndex,
    index
  )

  const handlePickCountChange = (e) => {
    handleChange('pickCount', parseInt(e.target.value, 10))
  }
  const handleDeliveryCountChange = (e) => {
    handleChange('deliverItemsCount', parseInt(e.target.value, 10))
  }
  const handleSectionScoreChange = (e) => {
    handleChange('itemsDefaultMaxScore', parseFloat(e.target.value, 10))
  }
  return (
    <ItemCountWrapper>
      <span>Pick </span>
      <Input
        type="number"
        disabled={disabled}
        min={1}
        max={100}
        value={
          showValue
            ? relevantGroup?.pickCount || relevantGroup?.items?.length || 2
            : ''
        }
        onChange={handlePickCountChange}
      />
      <span>item(s) and deliver</span>
      <Input
        type="number"
        disabled={disabled}
        value={showValue ? relevantGroup?.deliverItemsCount || '' : ''}
        min={1}
        onChange={handleDeliveryCountChange}
      />
      <span>random items per student with</span>
      <Input
        type="number"
        disabled={disabled}
        min={1}
        value={showValue ? relevantGroup?.itemsDefaultMaxScore || 1 : ''}
        onChange={handleSectionScoreChange}
      />
      <span>points for each question</span>
    </ItemCountWrapper>
  )
}
