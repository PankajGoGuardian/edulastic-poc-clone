import { segmentApi } from '@edulastic/api'
import { userPermissions } from '@edulastic/constants'
import React, { useEffect } from 'react'
import moment from 'moment'
import { subscription } from '../../constants/subscription'
import SubscriptionContainer from './SubscriptionContainer'

const DataStudioTab = ({ features, user }) => {
  const { dataWarehouseReports } = features
  const {
    permissionsExpiry: userPermissionsExpiry = [],
    orgData: { districts = [] } = {},
  } = user

  const districtPermissionExpiry =
    districts?.[0]?.districtPermissionsExpiry || []

  const districtDataWareHouseExpiryDate = districtPermissionExpiry.find(
    (item) => item.permissionKey === userPermissions.DATA_WAREHOUSE_REPORTS
  )?.perEndDate

  const userDataWareHouseExpiryDate = userPermissionsExpiry.find(
    (item) => item.permissionKey === userPermissions.DATA_WAREHOUSE_REPORTS
  )?.perEndDate

  let permissionEndDate = districtDataWareHouseExpiryDate

  if (
    !permissionEndDate ||
    (userDataWareHouseExpiryDate &&
      moment(userDataWareHouseExpiryDate).isAfter(permissionEndDate))
  ) {
    permissionEndDate = userDataWareHouseExpiryDate
  }

  const subscribed = dataWarehouseReports

  const showRequestOption = !subscribed

  const data = subscription.dataStudio({
    subscribed,
    expiryDate: permissionEndDate,
  })

  useEffect(() => {
    let eventName = 'DS: Sell page visited'
    let eventData = {}
    if (subscribed) {
      eventName = 'DS: subscription active'
      eventData = { ...user }
    }

    segmentApi.genericEventTrack(eventName, eventData)
  }, [])

  return (
    <SubscriptionContainer
      type="data-studio"
      showRequestOption={showRequestOption}
      data={data}
    />
  )
}

export default DataStudioTab
