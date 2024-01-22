import React from 'react'
import { Tag, Icon } from 'antd'
import { greenDark, darkBlue, lightBlue } from '@edulastic/colors'
import { userPermissions } from '@edulastic/constants'
import moment from 'moment'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { SUBSCRIPTION_TYPES } from '../constants/subscription'
import { getTutorMeSubscription } from '../Utils'

const dateFormat = 'DD MMM, YYYY'

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

const renderDSExpiryDate = (record, dateKey = 'perStartDate') => {
  const { _source: { permissionsExpiry = [], permissions = [] } = {} } = record
  const isDataStudio = permissions.includes(
    userPermissions.DATA_WAREHOUSE_REPORTS
  )
  const isDataStudioExpiry = permissionsExpiry.find(
    ({ permissionKey }) =>
      permissionKey === userPermissions.DATA_WAREHOUSE_REPORTS
  )

  return (
    <EduIf condition={isDataStudio && isDataStudioExpiry}>
      <EduThen>
        {moment(isDataStudioExpiry?.[dateKey]).format(dateFormat)}
      </EduThen>
      <EduElse>-</EduElse>
    </EduIf>
  )
}

export const renderStartDate = (subscription = {}, record) => {
  const { subStartDate, subRenewalDate } = subscription

  return (
    <span data-cy="userSubscriptionStartDate">
      <EduIf condition={subStartDate || subRenewalDate}>
        <EduThen>
          {moment(subStartDate || subRenewalDate).format(dateFormat)}
        </EduThen>
        <EduElse>{renderDSExpiryDate(record, 'perStartDate')}</EduElse>
      </EduIf>
    </span>
  )
}

export const renderEndDate = (subscription = {}, record) => {
  const { subEndDate } = subscription

  return (
    <span data-cy="userSubscriptionEndDate">
      <EduIf condition={subEndDate}>
        <EduThen>{moment(subEndDate).format(dateFormat)}</EduThen>
        <EduElse>{renderDSExpiryDate(record, 'perEndDate')}</EduElse>
      </EduIf>
    </span>
  )
}

export const renderTutorMeStartDate = (subscription) => {
  const { startDate: tutorMeStartDate } = getTutorMeSubscription(subscription)
  return (
    <span data-cy="userSubscriptionTutorMeStartDate">
      <EduIf condition={tutorMeStartDate}>
        <EduThen>{moment(tutorMeStartDate).format(dateFormat)}</EduThen>
        <EduElse>-</EduElse>
      </EduIf>
    </span>
  )
}

export const renderTutorMeEndDate = (subscription) => {
  const { endDate: tutorMeEndDate } = getTutorMeSubscription(subscription)
  return (
    <span data-cy="userSubscriptionTutorMeEndDate">
      <EduIf condition={tutorMeEndDate}>
        <EduThen>{moment(tutorMeEndDate).format(dateFormat)}</EduThen>
        <EduElse>-</EduElse>
      </EduIf>
    </span>
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
