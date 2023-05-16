import React from 'react'
import PropTypes from 'prop-types'

import { FlexContainer } from '@edulastic/common'
import { StyledContainer } from '../../common/styled'
import { SubHeader } from '../../common/components/Header'
import CustomReportsWrapper from './CustomReportsWrapper'

const CustomReports = ({ history, breadcrumbData, isCliUser }) => {
  const showReport = (_id) => {
    history.push(`/author/reports/custom-reports/${_id}`)
  }

  return (
    <>
      <FlexContainer justifyContent="space-between" marginBottom="10px">
        <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser} />
      </FlexContainer>
      <StyledContainer>
        <CustomReportsWrapper showReport={showReport} />
      </StyledContainer>
    </>
  )
}

CustomReports.propTypes = {
  history: PropTypes.object.isRequired,
}

export default CustomReports
