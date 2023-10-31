import React, { useEffect, useMemo, useState } from 'react'
import { manageSubscriptionsApi } from '@edulastic/api'
import styled from 'styled-components'
import {
  EduIf,
  EduThen,
  EduElse,
  EduButton,
  CustomModalStyled,
  useApiQuery,
  notification,
} from '@edulastic/common'
import { themeColor } from '@edulastic/colors'

import loadable from '@loadable/component'
import { getTimestampFromMongoId } from '@edulastic/common/src/helpers'
import { isEmpty } from 'lodash'
import { SUBSCRIPTION_DEFINITION_TYPES } from '../Data'

const ManageSubscription = loadable(() =>
  import('../../author/ManageSubscription')
)
const ManageSubscriptionByDistrictAndUserId = ({
  districtId,
  setLicenseDetails,
  licenseDetails = {},
  userId,
  fieldData,
  setFieldData,
  districtList,
  isFetchingOrganization,
  handleSelectDistrict,
  handleSearch,
  deleteLicense,
  addSubscription,
  searchRequest,
  searchType,
  page,
}) => {
  const [isVisible, setVisible] = useState(false)

  const getPremiumQuantityClosestToEndDate = (data) => {
    const sortedLicenses = data.sort((a, b) => {
      const timestampA = getTimestampFromMongoId(a.licenseId)
      const timestampB = getTimestampFromMongoId(b.licenseId)

      return timestampA - timestampB
    })

    return sortedLicenses[0].quantity
  }

  const sanitizeLicensesDetails = (data) => {
    const licenseIds = []
    const productIds = []
    let premiumQuantity = 0
    const premiumLicenses = data?.licenses?.filter(
      (license) =>
        license?.productType === SUBSCRIPTION_DEFINITION_TYPES.PREMIUM
    )

    if (premiumLicenses?.length === 1) {
      premiumQuantity = premiumLicenses[0]?.quantity
    } else if (premiumLicenses?.length > 1) {
      premiumQuantity = getPremiumQuantityClosestToEndDate(premiumLicenses)
    }

    data?.licenses?.forEach((license) => {
      licenseIds?.push(license?.licenseId)
      productIds?.push(license?.productId)
    })

    return { ownerId: data?.ownerId, licenseIds, productIds, premiumQuantity }
  }

  const query = useMemo(
    () => ({
      districtId,
      type: 'BULK_LICENSES',
      userId,
      isLicensesRequired: true,
    }),
    [districtId, userId]
  )

  const { data, loading } = useApiQuery(
    manageSubscriptionsApi.getAllLicensedUserInDistrict,
    [query],
    {
      enabled: !isEmpty(districtId) && !isEmpty(userId) && !isVisible,
      deDuplicate: false,
    }
  )

  useEffect(() => {
    if (loading) {
      setLicenseDetails({ loading })
    }
    if (!isEmpty(data)) {
      let licenses = data
      if (!data?.error) {
        licenses = sanitizeLicensesDetails(data)
      } else {
        notification({ type: 'error', msg: data.message })
      }
      setLicenseDetails({ loading, ...licenses })
    }
  }, [data, loading])

  const handleAddSubscription = () => {
    setVisible(false)
  }

  const title = (
    <TitleContainer>
      <span>Manage Subscription</span>
      <EduButton onClick={handleAddSubscription}>Add Subscription</EduButton>
    </TitleContainer>
  )

  return (
    <Container>
      <EduIf condition={licenseDetails?.loading}>
        <EduThen>
          <Message isCenter>Please wait,fetching license details...</Message>
        </EduThen>
        <EduElse>
          <EduIf condition={licenseDetails?.licenseIds?.length > 0}>
            <span>
              This organization has already some subscriptions click
              <ManageSubscriptionText onClick={() => setVisible(true)}>
                Manage Subscription
              </ManageSubscriptionText>
              to Renew, Edit or Delete
            </span>
          </EduIf>
        </EduElse>
      </EduIf>

      <ManageSubscriptionModal
        visible={isVisible}
        title={title}
        onCancel={() => setVisible(false)}
        fullscreen
        destroyOnClose
        footer={null}
      >
        <SubscriptionContainer>
          <ManageSubscription
            isEdulasticAdminView
            licenseIds={licenseDetails?.licenseIds}
            districtId={districtId}
            licenseOwnerId={licenseDetails?.ownerId}
            fieldData={fieldData}
            setFieldData={setFieldData}
            isFetchingOrganization={isFetchingOrganization}
            districtList={districtList}
            handleSelectDistrict={handleSelectDistrict}
            handleSearch={handleSearch}
            deleteLicense={deleteLicense}
            addSubscription={addSubscription}
            searchRequest={searchRequest}
            searchType={searchType}
            page={page}
            allowManageSubscription
          />
        </SubscriptionContainer>
      </ManageSubscriptionModal>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`
const Message = styled.p`
  font-size: 16px !important;
  text-align: ${({ isCenter }) => (isCenter ? 'center' : '')};
`

const SubscriptionContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: column;
`

const ManageSubscriptionModal = styled(CustomModalStyled)`
  min-width: 100%;
  padding-bottom: 0px;
  top: 0px;
  .ant-modal-content {
    border-radius: 0px;
    min-height: 100vh;
  }
`
const ManageSubscriptionText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${themeColor};
  padding: 0 4px 0 4px;
  cursor: pointer;
`
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 40px;
`
export default ManageSubscriptionByDistrictAndUserId
