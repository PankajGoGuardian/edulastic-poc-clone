import React from 'react'
import { Tag, Icon } from 'antd'
import { greenDark, darkBlue, lightBlue } from '@edulastic/colors'
import { userPermissions } from '@edulastic/constants'
import { SUBSCRIPTION_TYPES } from '../constants/subscription'

export function renderSubscriptionType(subscription = {}, record) {
  const { subType = 'free', updatedSubTypeSuccess } = subscription

  const isDataStudio = (record?._source?.permissions || []).includes(
    userPermissions.DATA_WAREHOUSE_REPORTS
  )

  let _subType = subType
  if (isDataStudio) {
    if (subType === SUBSCRIPTION_TYPES.free.subType) {
      _subType = SUBSCRIPTION_TYPES.dataStudio.label
    } else if (subType === SUBSCRIPTION_TYPES.premium.subType) {
      _subType = SUBSCRIPTION_TYPES.premiumPlusDataStudio.label
    }
  }

  return (
    <>
      <SubTypeTag style={{ marginRight: '5px' }}>{_subType}</SubTypeTag>
      {typeof updatedSubTypeSuccess === 'undefined' ? null : (
        <Icon
          title={`Update ${updatedSubTypeSuccess ? 'success' : 'failed'}`}
          type={updatedSubTypeSuccess ? 'check-circle' : 'warning'}
        />
      )}
    </>
  )
}

export default function SubTypeTag({ children }) {
  const color = {
    [SUBSCRIPTION_TYPES.free.subType]: greenDark,
    [SUBSCRIPTION_TYPES.dataStudio.label]: greenDark,
    [SUBSCRIPTION_TYPES.enterprise.subType]: darkBlue,
    [SUBSCRIPTION_TYPES.enterprisePlusDataStudio.label]: darkBlue,
    [SUBSCRIPTION_TYPES.partialPremium.subType]: lightBlue,
    [SUBSCRIPTION_TYPES.premium.subType]: '#FFC400',
    [SUBSCRIPTION_TYPES.premiumPlusDataStudio.label]: '#FFC400',
  }
  return (
    <Tag
      color={color[children]}
      overflow="hidden"
      textOverflow="ellipsis"
      style={{ whiteSpace: 'normal' }}
    >
      {children}
    </Tag>
  )
}
