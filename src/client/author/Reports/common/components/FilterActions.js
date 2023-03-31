import { Col } from 'antd'
import React from 'react'
import { StyledEduButton } from '../styled'

function FilterActions({
  toggleFilter,
  showApply,
  loadingFiltersData,
  onGoClick,
}) {
  return (
    <Col span={24} style={{ display: 'flex', paddingTop: '20px' }}>
      <StyledEduButton
        width="25%"
        height="40px"
        style={{ maxWidth: '200px' }}
        isGhost
        key="cancelButton"
        data-cy="cancelFilter"
        data-testid="cancelFilter"
        onClick={(e) => toggleFilter(e, false)}
      >
        Cancel
      </StyledEduButton>
      <StyledEduButton
        width="25%"
        height="40px"
        style={{ maxWidth: '200px' }}
        key="applyButton"
        data-cy="applyFilter"
        data-testid="applyFilter"
        disabled={!showApply || loadingFiltersData}
        onClick={() => onGoClick()}
      >
        Apply
      </StyledEduButton>
    </Col>
  )
}
export default FilterActions
