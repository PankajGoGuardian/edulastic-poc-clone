import React from 'react'
import { Tag, Icon } from 'antd'
import { greenDark, darkBlue, lightBlue } from '@edulastic/colors'
import moment from 'moment'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import {
  ADDITIONAL_SUBSCRIPTION_TYPES,
  SUBSCRIPTION_TYPES,
} from '../constants/subscription'
import { getAdditionalSubscription } from '../Utils'

const dateFormat = 'DD MMM, YYYY'

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

export const renderStartDate = (subscription = {}) => {
  const { subStartDate, subRenewalDate } = subscription

  return (
    <span data-cy="userSubscriptionStartDate">
      <EduIf condition={subStartDate || subRenewalDate}>
        <EduThen>
          {moment(subStartDate || subRenewalDate).format(dateFormat)}
        </EduThen>
        <EduElse>-</EduElse>
      </EduIf>
    </span>
  )
}

export const renderEndDate = (subscription = {}) => {
  const { subEndDate } = subscription

  return (
    <span data-cy="userSubscriptionEndDate">
      <EduIf condition={subEndDate}>
        <EduThen>{moment(subEndDate).format(dateFormat)}</EduThen>
        <EduElse>-</EduElse>
      </EduIf>
    </span>
  )
}

export const renderTutorMeStartDate = (subscription) => {
  const { startDate: tutorMeStartDate } = getAdditionalSubscription(
    subscription,
    ADDITIONAL_SUBSCRIPTION_TYPES.TUTORME
  )
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
  const { endDate: tutorMeEndDate } = getAdditionalSubscription(
    subscription,
    ADDITIONAL_SUBSCRIPTION_TYPES.TUTORME
  )
  return (
    <span data-cy="userSubscriptionTutorMeEndDate">
      <EduIf condition={tutorMeEndDate}>
        <EduThen>{moment(tutorMeEndDate).format(dateFormat)}</EduThen>
        <EduElse>-</EduElse>
      </EduIf>
    </span>
  )
}

export const renderTutorMeAuthToken = (subscription) => {
  const { authToken: tutorMeAuthToken } = getAdditionalSubscription(
    subscription,
    ADDITIONAL_SUBSCRIPTION_TYPES.TUTORME
  )
  return (
    <span data-cy="userSubscriptionTutorMeAuthToken">
      {tutorMeAuthToken || '-'}
    </span>
  )
}

export const renderDataStudioStartDate = (subscription) => {
  const { startDate: dataStudioStartDate } = getAdditionalSubscription(
    subscription,
    ADDITIONAL_SUBSCRIPTION_TYPES.DATA_WAREHOUSE_REPORTS
  )
  return (
    <span data-cy="userSubscriptionDataStudioStartDate">
      <EduIf condition={dataStudioStartDate}>
        <EduThen>{moment(dataStudioStartDate).format(dateFormat)}</EduThen>
        <EduElse>-</EduElse>
      </EduIf>
    </span>
  )
}

export const renderDataStudioEndDate = (subscription) => {
  const { endDate: dataStudioEndDate } = getAdditionalSubscription(
    subscription,
    ADDITIONAL_SUBSCRIPTION_TYPES.DATA_WAREHOUSE_REPORTS
  )
  return (
    <span data-cy="userSubscriptionDataStudioEndDate">
      <EduIf condition={dataStudioEndDate}>
        <EduThen>{moment(dataStudioEndDate).format(dateFormat)}</EduThen>
        <EduElse>-</EduElse>
      </EduIf>
    </span>
  )
}

export default function SubTypeTag({ children }) {
  const color = {
    [SUBSCRIPTION_TYPES.free.subType]: greenDark,
    [SUBSCRIPTION_TYPES.enterprise.subType]: darkBlue,
    [SUBSCRIPTION_TYPES.partialPremium.subType]: lightBlue,
    [SUBSCRIPTION_TYPES.premium.subType]: '#FFC400',
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
