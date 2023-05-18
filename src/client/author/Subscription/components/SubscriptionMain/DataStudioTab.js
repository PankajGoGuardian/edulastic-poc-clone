import { segmentApi } from '@edulastic/api'
import { userPermissions } from '@edulastic/constants'
import React, { useEffect } from 'react'
import { subscription } from '../../constants/subscription'
import SubscriptionContainer from './SubscriptionContainer'

const DataStudioTab = ({ features, user }) => {
  const { dataWarehouseReports } = features
  const { permissionsExpiry = [], orgData: { districts = [] } = {} } = user
  const districtPermissionExpiry =
    districts?.[0]?.districtPermissionsExpiry || []
  const _permissionExpiry =
    permissionsExpiry.length > 0 ? permissionsExpiry : districtPermissionExpiry
  const dataWareHouseExpiry = _permissionExpiry.find(
    (item) => item.permissionKey === userPermissions.DATA_WAREHOUSE_REPORTS
  )
  const subscribed = dataWarehouseReports

  const showRequestOption = !subscribed

  const data = subscription.dataStudio({
    subscribed,
    expiryDate: dataWareHouseExpiry?.perEndDate,
  })

  useEffect(() => {
    segmentApi.genericEventTrack(`DS: Sell page visited`, {})
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
