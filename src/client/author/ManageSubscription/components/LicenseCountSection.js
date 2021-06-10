import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { EduButton, FlexContainer } from '@edulastic/common'
import { Count, Countbox, GreyBox, LeftCol, RightCol } from './styled'

const LicenseCountSection = ({
  subsLicenses,
  setShowBuyMoreModal,
  setCurrentItemId,
  isEdulasticAdminView,
  setSelectedLicenseId,
}) => {
  const openBuyMoreModal = (itemId, licenseId) => {
    setShowBuyMoreModal(true)
    setCurrentItemId(itemId)
    setSelectedLicenseId(licenseId)
  }

  const { totalCount: totalTpLicenseCount = 0 } =
    (subsLicenses &&
      subsLicenses.find(({ productType }) => productType === 'PREMIUM')) ||
    {}
  const LicenseCountContainer =
    subsLicenses &&
    subsLicenses.map((license) => (
      <GreyBox>
        <LeftCol>
          <span data-cy={`${license.productName}-expiresOn`}>
            Expires {moment(license.expiresOn).format('MMM DD, YYYY')}
          </span>
          <h4>{license.productName}</h4>
          <EduButton
            disabled={
              !(license.productType === 'PREMIUM') &&
              !(
                license.productType !== 'PREMIUM' &&
                license.totalCount < totalTpLicenseCount
              )
            }
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
    <FlexContainer justifyContent="space-between" flexWrap="wrap">
      {LicenseCountContainer}
    </FlexContainer>
  )
}

LicenseCountSection.propTypes = {
  setShowBuyMoreModal: PropTypes.func,
}
LicenseCountSection.defaultProps = {
  setShowBuyMoreModal: () => {},
}

export default LicenseCountSection
