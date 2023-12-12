import { segmentApi } from '@edulastic/api'
import { userPermissions } from '@edulastic/constants'
import React, { useEffect } from 'react'
import moment from 'moment'
import { IconDSSellPage } from '@edulastic/icons'
import { EduButton, FlexContainer } from '@edulastic/common'
import { reportGroupType } from '@edulastic/constants/const/report'
import { subscription } from '../../constants/subscription'
import SubscriptionContainer from './SubscriptionContainer'
import {
  MiddleContentWrapper,
  SectionDescription,
  SectionTitle,
} from './styled'
import { proxyDemoPlaygroundUser } from '../../../authUtils'

const { DATA_WAREHOUSE_REPORT } = reportGroupType
const DATA_STUDIO_REPORTS_PATH = `/author/reports/${DATA_WAREHOUSE_REPORT}`

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

  const handleOnViewSampleReportsClick = (evt) => {
    evt.stopPropagation()
    const elementClasses = evt.currentTarget.getAttribute('class')
    proxyDemoPlaygroundUser(
      elementClasses.indexOf('automation') > -1,
      DATA_STUDIO_REPORTS_PATH
    )
  }

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
    <>
      <SubscriptionContainer
        type="data-studio"
        showRequestOption={showRequestOption}
        data={data}
        additionalContent={
          <MiddleContentWrapper
            justifyContent="space-between"
            alignItems="center"
            marginBottom="20px"
          >
            <FlexContainer
              flexDirection="column"
              justifyContent="space-between"
              padding="20px"
              style={{ gap: '10px' }}
            >
              <SectionTitle>Explore Sample Reports</SectionTitle>
              <SectionDescription>
                Experience firsthand how Data Studio can empower you with
                actionable insights to enhance student performance.
              </SectionDescription>
              <EduButton
                isBlue
                height="30px"
                width="100px"
                onClick={handleOnViewSampleReportsClick}
              >
                VIEW NOW
              </EduButton>
            </FlexContainer>
            <IconDSSellPage />
          </MiddleContentWrapper>
        }
      />
    </>
  )
}

export default DataStudioTab
