import React, { useMemo, useState } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import {
  EduButton,
  EduIf,
  FlexContainer,
  notification,
} from '@edulastic/common'
import { ONE_MONTH_IN_MILLISECONDS } from '@edulastic/constants/const/common'
import { SUBSCRIPTION_SUB_TYPES } from '@edulastic/constants/const/subscriptions'
import {
  Count,
  Countbox,
  GreyBox,
  LeftCol,
  RightCol,
  StyledButton,
} from './styled'
import { SUBSCRIPTION_DEFINITION_TYPES } from '../../../admin/Data'
import AddSubscriptionModal from '../../../admin/Upgrade/AddSubscriptionModal'
import DeleteLicenseModal from './DeleteLicenseModal'

const { PREMIUM } = SUBSCRIPTION_DEFINITION_TYPES
const { PARTIAL_PREMIUM, ENTERPRISE } = SUBSCRIPTION_SUB_TYPES

const LicenseCountSection = ({
  subsLicenses,
  setShowBuyMoreModal,
  setCurrentItemId,
  isEdulasticAdminView,
  setSelectedLicenseId,
  setShowRenewLicenseModal,
  setQuantities,
  subType,
  licenseOwnerId,
  products,
  isFetchingOrganization,
  districtList,
  searchRequest,
  addSubscription,
  handleSelectDistrict,
  handleSearch,
  fieldData,
  setFieldData,
  deleteLicense,
  searchType,
  page,
  allowManageSubscription,
}) => {
  const [showSubscriptionAddonModal, setShowAddSubscriptionModal] = useState(
    false
  )
  const [archiveNotes, setArchiveNotes] = useState('')
  const [showDeleteLicenseModal, setShowDeleteLicenseModal] = useState(false)
  const [currentLicense, setCurrentLicense] = useState({})
  const [isEdited, setIsEdited] = useState(false)
  const closeAddSubscriptionModal = () => {
    setShowAddSubscriptionModal(false)
    setIsEdited(false)
    setFieldData((prevData) => ({
      ...prevData,
      [currentLicense.productType]: '',
      customerSuccessManager: '',
      opportunityId: '',
      notes: '',
      managerEmail: [],
      subEndDate: '',
      subStartDate: '',
    }))
  }
  const clickOnEdit = (license) => {
    setCurrentLicense(license)
    setShowAddSubscriptionModal(true)
    setFieldData((prevData) => ({
      ...prevData,
      [license.productType]: license.totalCount,
      customerSuccessManager: license.customerSuccessManager,
      notes: license.notes,
      opportunityId: license.opportunityId,
      managerEmail: license.ownersEmails.map(({ email }) => email),
      subStartDate: license.subStartDate,
      subEndDate: license.subEndDate,
    }))
  }
  const onDeleteLicense = () => {
    if (archiveNotes) {
      deleteLicense({
        licenseIds: [currentLicense.licenseId],
        licenseOwnerId,
        notes: archiveNotes,
        handleSingleLicense: true,
        search: {
          type: searchType,
          page,
          limit: 10,
        },
      })
      setCurrentLicense({})
      setShowDeleteLicenseModal(false)
      setArchiveNotes('')
    } else
      notification({
        type: 'warning',
        msg: 'Please provide notes before archiving',
      })
  }

  const openDeleteLicenseModal = (license) => {
    setCurrentLicense(license)
    setShowDeleteLicenseModal(true)
  }
  const onCancelDeleteLiceseModal = () => {
    setShowDeleteLicenseModal(false)
    setArchiveNotes('')
  }
  const openBuyMoreModal = (itemId, licenseId) => {
    setShowBuyMoreModal(true)
    setCurrentItemId(itemId)
    setSelectedLicenseId(licenseId)
  }

  const openRenewModal = (itemId, licenseId, totalCount) => {
    setQuantities({ [itemId]: totalCount })
    setShowRenewLicenseModal(true)
    setCurrentItemId(itemId)
    setSelectedLicenseId(licenseId)
  }

  const { totalCount: totalTpLicenseCount = 0 } =
    subsLicenses?.find(({ productType }) => productType === PREMIUM) || {}

  const checkIsBtnDisabled = (license) =>
    [
      license.productType !== PREMIUM,
      license.totalCount >= totalTpLicenseCount,
    ].every((o) => !!o)

  const canShowRenewLicenseButton = (license) => {
    const { expiresOn: licenseExpiryDate, productType } = license
    const licenseExpiryDateInTS = new Date(licenseExpiryDate).getTime()
    const expiresWithinAMonth =
      Date.now() + ONE_MONTH_IN_MILLISECONDS > licenseExpiryDateInTS
    const isNotExpired = Date.now() < licenseExpiryDateInTS
    const isAboutToExpire = expiresWithinAMonth && isNotExpired

    const needsRenewal = [
      isAboutToExpire,
      ![ENTERPRISE, PARTIAL_PREMIUM].includes(subType),
    ].every((o) => !!o)

    if (needsRenewal && productType !== PREMIUM) {
      const tpLicense = subsLicenses.find((o) => o.productType === PREMIUM)
      const tpLicenseExpiryDateInTS = new Date(tpLicense.expiresOn).getTime()
      const isTeacherPremiumRenewed =
        Date.now() + ONE_MONTH_IN_MILLISECONDS < tpLicenseExpiryDateInTS
      return isTeacherPremiumRenewed
    }

    return needsRenewal
  }
  const filteredProducts = useMemo(
    () =>
      products
        ?.filter(({ name }) => name === currentLicense.productName)
        .map((product) => {
          const { id, ...rest } = product
          return { _id: id, ...rest }
        }),
    [currentLicense.productName, products]
  )

  const subscLicenseExceptTeacherPremium =
    subsLicenses?.filter(({ productType }) => productType !== PREMIUM) || []

  const LicenseCountContainer =
    subsLicenses &&
    subsLicenses.map((license) => (
      <GreyBox>
        <LeftCol>
          <span data-cy={`${license.productName}-expiresOn`}>
            Expires {moment(license.expiresOn).format('MMM DD, YYYY')}
          </span>
          <h4>{license.productName}</h4>
          <FlexContainer justifyContent="flex-start">
            <EduIf condition={canShowRenewLicenseButton(license)}>
              <StyledButton
                key={`renew-${license.productId}`}
                isGhost
                height="24px"
                mr="10px"
                ml="0px"
                onClick={() =>
                  openRenewModal(
                    license.productId,
                    license.licenseId,
                    license.totalCount
                  )
                }
                data-cy={`${license.productName}-renewLicences`}
              >
                Renew Licenses
              </StyledButton>
            </EduIf>
            <EduButton
              disabled={checkIsBtnDisabled(license)}
              key={license.productId}
              isGhost
              height="24px"
              ml="0px"
              onClick={() =>
                openBuyMoreModal(license.productId, license.licenseId)
              }
              data-cy="buyMoreLicenseButton"
            >
              {isEdulasticAdminView ? 'Add More' : 'Buy More'}
            </EduButton>
            <EduIf condition={isEdulasticAdminView}>
              <EduButton
                key={`edit-${license.productId}`}
                isGhost
                height="24px"
                mr="10px"
                ml="10px"
                onClick={() => clickOnEdit(license)}
                data-cy={`${license.productName}-editLicense`}
              >
                Edit
              </EduButton>
              <EduIf
                condition={
                  license.productType !== PREMIUM ||
                  !subscLicenseExceptTeacherPremium.length
                }
              >
                <StyledButton
                  key={`delete-${license.productId}`}
                  isGhost
                  height="24px"
                  mr="10px"
                  ml="0px"
                  onClick={() => openDeleteLicenseModal(license)}
                  data-cy={`${license.productName}-delete`}
                >
                  Delete
                </StyledButton>
              </EduIf>
            </EduIf>
          </FlexContainer>
        </LeftCol>
        <RightCol>
          <Countbox>
            <Count data-cy={`${license.productName}-totalCount`}>
              {license.totalCount}
            </Count>
            <span>Purchased</span>
          </Countbox>
          <Countbox>
            <Count data-cy={`${license.productName}-availableCount`}>
              {license.totalCount - license.usedCount}
            </Count>
            <span>Available</span>
          </Countbox>
        </RightCol>
      </GreyBox>
    ))

  return (
    <>
      <FlexContainer justifyContent="space-between" flexWrap="wrap">
        {LicenseCountContainer}
      </FlexContainer>
      <EduIf condition={isEdulasticAdminView}>
        <AddSubscriptionModal
          isVisible={showSubscriptionAddonModal}
          closeModal={closeAddSubscriptionModal}
          districtList={districtList}
          isFetchingOrganization={isFetchingOrganization}
          products={filteredProducts}
          fieldData={fieldData}
          setFieldData={setFieldData}
          searchRequest={searchRequest}
          addSubscription={addSubscription}
          handleSearch={handleSearch}
          handleSelectDistrict={handleSelectDistrict}
          editLicense
          currentLicense={currentLicense}
          licenseId={currentLicense.licenseId}
          licenseOwnerId={licenseOwnerId}
          totalTpLicenseCount={totalTpLicenseCount}
          isEdited={isEdited}
          setIsEdited={setIsEdited}
          allowManageSubscription={allowManageSubscription}
        />
        <DeleteLicenseModal
          visible={showDeleteLicenseModal}
          onCancel={onCancelDeleteLiceseModal}
          onDeleteLicense={onDeleteLicense}
          setNotes={setArchiveNotes}
          notes={archiveNotes}
        />
      </EduIf>
    </>
  )
}

LicenseCountSection.propTypes = {
  setShowBuyMoreModal: PropTypes.func,
  setShowRenewLicenseModal: PropTypes.func,
}
LicenseCountSection.defaultProps = {
  setShowBuyMoreModal: () => {},
  setShowRenewLicenseModal: () => {},
}

export default LicenseCountSection
