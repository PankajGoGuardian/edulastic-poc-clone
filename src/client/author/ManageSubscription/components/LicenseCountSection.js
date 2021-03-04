import React, { useMemo } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { EduButton, FlexContainer } from '@edulastic/common'
import { groupBy, keyBy } from 'lodash'
import { Count, Countbox, GreyBox, LeftCol, RightCol } from './styled'

const LicenseCountSection = ({
  subsLicenses = [],
  setShowBuyMoreModal,
  setCurrentItemId,
  isEdulasticAdminView,
}) => {
  const openBuyMoreModal = (itemId) => {
    setShowBuyMoreModal(true)
    setCurrentItemId(itemId)
  }

  const licensesGroupedByType = groupBy(subsLicenses, 'productType')

  const mergedLicenses = useMemo(() => {
    const availableProductIds =
      Object.keys(keyBy(subsLicenses, 'productId')) || []

    if (availableProductIds.length !== subsLicenses.length) {
      return Object.keys(licensesGroupedByType).map((x) =>
        licensesGroupedByType[x].reduce(
          (a, c) => {
            const result = { ...a }
            result.expiresOn.push(c.expiresOn)
            result.licenseIds.push(c.licenseId)
            result.totalCount += c.totalCount
            result.usedCount += c.usedCount
            result.linkedProductId = c.linkedProductId
            result.productId = c.productId
            result.productName = c.productName
            result.productType = c.productType
            return result
          },
          {
            expiresOn: [],
            licenseIds: [],
            totalCount: 0,
            usedCount: 0,
          }
        )
      )
    }
  }, [subsLicenses])

  console.log('subsLicenses', {
    subsLicenses,
    mergedLicenses,
  })

  const showLicenses =
    mergedLicenses?.length > 0 ? mergedLicenses : subsLicenses

  const LicenseCountContainer = showLicenses.map((license) => (
    <GreyBox>
      <LeftCol>
        <span data-cy={`${license.productName}-expiresOn`}>
          Expires{' '}
          {Array.isArray(license.expiresOn)
            ? license.expiresOn
                .map((date) => moment(date).format('MMM DD, YYYY'))
                .join(', ')
            : moment(license.expiresOn).format('MMM DD, YYYY')}
        </span>
        <h4>{license.productName}</h4>
        <EduButton
          key={license.productId}
          isGhost
          height="24px"
          ml="0px"
          onClick={() => openBuyMoreModal(license.productId)}
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
