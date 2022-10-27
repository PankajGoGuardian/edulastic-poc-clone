import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Row } from 'antd'

import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'

const PerformanceByRubricCriteria = () => {
  // data size exceeding template
  // if (error && error.dataSizeExceeded) {
  //   return <DataSizeExceeded />
  // }

  // No data container template
  // if (!denormalizedData?.length) {
  //   return (
  //     <NoDataContainer>
  //       {settings.requestFilters?.termId ? 'No data available currently.' : ''}
  //     </NoDataContainer>
  //   )
  // }

  return (
    <div>
      <StyledCard>
        <Row type="flex" justify="start">
          <StyledH3 margin="0 0 10px 50px">
            Performance by Rubric criteria
          </StyledH3>
        </Row>
        <Row>{/* Chart component */}</Row>
        {/* Table container */}
      </StyledCard>
    </div>
  )
}

const enhance = compose(connect(() => ({}), {}))

export default enhance(PerformanceByRubricCriteria)
