import React from 'react'
import { Tag, Icon } from 'antd'
import { greenDark, darkBlue, lightBlue } from '@edulastic/colors'

export function renderSubscriptionType(subscription = {}) {
  const { subType = 'free', updatedSubTypeSuccess } = subscription
  return (
    <>
      <SubTypeTag style={{ marginRight: '5px' }}>{subType}</SubTypeTag>
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
    free: greenDark,
    enterprise: darkBlue,
    partial_premium: lightBlue,
    premium: '#FFC400',
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
