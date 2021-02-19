import { EduButton, FlexContainer } from '@edulastic/common'
import PropTypes from 'prop-types'
import React from 'react'
import { Count, Countbox, GreyBox, LeftCol, RightCol } from './styled'

const LicenseCountSection = ({
  subsLicenses,
  setShowBuyMoreModal,
  setIsBuyMoreModalOpened,
}) => {
  const openPremiumModal = () => {
    setIsBuyMoreModalOpened('PREMIUM')
    setShowBuyMoreModal(true)
  }

  const openSparkMathModal = () => {
    setIsBuyMoreModalOpened('SPARK_MATH')
    setShowBuyMoreModal(true)
  }

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
            onClick={
              license.productType === 'PREMIUM'
                ? openPremiumModal
                : openSparkMathModal
            }
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
  setShowBuyMoreModal: PropTypes.func,
  setIsBuyMoreModalOpened: PropTypes.func,
}
LicenseCountSection.defaultProps = {
  setShowBuyMoreModal: () => {},
  setIsBuyMoreModalOpened: () => {},
}

export default LicenseCountSection
