import { EduButton, FlexContainer } from '@edulastic/common'
import PropTypes from 'prop-types'
import React from 'react'
import { Count, Countbox, GreyBox, LeftCol, RightCol } from './styled'

const LicenseCountSection = ({ subsLicenses, setShowManageLicenseModal }) => {
  const openModal = () => setShowManageLicenseModal(true)

  const LicenseCountContainer =
    subsLicenses &&
    subsLicenses.map((license) => (
      <GreyBox>
        <LeftCol>
          <span>Expires {license.expiresOn}</span>
          <h4>{license.productName}</h4>
          <EduButton
            isGhost
            height="24px"
            ml="0px"
            onClick={openModal}
            data-cy="buyMoreLicenseButton"
          >
            buy more
          </EduButton>
        </LeftCol>
        <RightCol>
          <Countbox>
            <Count>{license.totalCount}</Count>
            <span>Purchased</span>
          </Countbox>
          <Countbox>
            <Count>{license.totalCount - license.usedCount}</Count>
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
  setShowManageLicenseModal: PropTypes.func,
}
LicenseCountSection.defaultProps = {
  setShowManageLicenseModal: () => {},
}

export default LicenseCountSection
