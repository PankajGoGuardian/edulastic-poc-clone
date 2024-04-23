import moment from 'moment'
import { useEffect, useRef } from 'react'
import { notification } from '@edulastic/common'
import { roleuser, userPermissions } from '@edulastic/constants'
import { EMPTY_ARRAY } from '@edulastic/constants/reportUtils/common'
import { ADDITIONAL_SUBSCRIPTION_TYPES } from '../constants/subscription'

export const getDate = () => {
  const currentDate = new Date()
  const oneYearDate = new Date(
    new Date().setFullYear(currentDate.getFullYear() + 1)
  )
  return {
    currentDate: currentDate.getTime(),
    oneYearDate: oneYearDate.getTime(),
  }
}

// a custom effect which does not run after the initial render, but runs on every subsequent render
export function useUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) fn()
    else didMountRef.current = true
  }, inputs)
}

export const isEASuperAdmin = (permissions, role) =>
  role === roleuser.EDULASTIC_ADMIN &&
  permissions.includes(userPermissions.SUPER_ADMIN)

export const validateForTutorMeAuthTokenCheck = ({
  tutorMeStartDate,
  tutorMeEndDate,
  tutorMeAuthToken,
  tutorMeAuthTokenCheck,
}) => {
  const condition =
    (tutorMeStartDate || tutorMeEndDate) &&
    tutorMeAuthToken &&
    !tutorMeAuthTokenCheck
  if (condition) {
    notification({ msg: 'Double-check TutorMe Authentication Key' })
  }
  return !condition
}

export const getAdditionalSubscription = (
  subscription,
  additionalSubscriptionType
) => {
  const { additionalSubscriptions = EMPTY_ARRAY } = subscription || {}
  const additionalSubscription =
    additionalSubscriptions.find(
      (s) => s.type === additionalSubscriptionType
    ) || {}
  return additionalSubscription
}

export const checkIsDataStudioEnabled = (additionalSubscriptions) => {
  const currentDate = moment().valueOf()
  return additionalSubscriptions.some((s) => {
    return (
      s.type === ADDITIONAL_SUBSCRIPTION_TYPES.DATA_WAREHOUSE_REPORTS &&
      s.endDate > currentDate
    )
  })
}

export const getNextAdditionalSubscriptions = ({
  tutorMeStartDate,
  tutorMeEndDate,
  tutorMeAuthToken,
  tutorMeAuthTokenCheck = true, // default=true to bypass validation check if not required
  dataStudioStartDate,
  dataStudioEndDate,
}) => {
  const nextAdditionalSubscriptions = [
    {
      type: ADDITIONAL_SUBSCRIPTION_TYPES.TUTORME,
      startDate: tutorMeStartDate,
      endDate: tutorMeEndDate,
      authToken: tutorMeAuthToken,
    },
    {
      type: ADDITIONAL_SUBSCRIPTION_TYPES.DATA_WAREHOUSE_REPORTS,
      startDate: dataStudioStartDate,
      endDate: dataStudioEndDate,
    },
  ]
  // filter out additional subscriptions with empty startDate/endDate etc.
  return nextAdditionalSubscriptions.filter((s) => {
    const startDateCheck = !!s.startDate
    const endDateCheck = !!s.endDate
    const tutorMeCheck =
      s.type !== ADDITIONAL_SUBSCRIPTION_TYPES.TUTORME ||
      (s.authToken && tutorMeAuthTokenCheck)
    return startDateCheck && endDateCheck && tutorMeCheck
  })
}
