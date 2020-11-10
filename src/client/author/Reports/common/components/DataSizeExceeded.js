import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { NoDataContainer } from '../styled'

const NoDataContainerCentered = styled(NoDataContainer)`
  flex-direction: column;
  text-align: center;
  p {
    color: ${(props) =>
      (props.theme.assignment && props.theme.assignment.helpTextColor) ||
      '#848993'};
    font-size: ${(props) => props.theme.noData.NoDataArchiveSubTextSize};
    line-height: 22px;
    font-weight: normal;
  }
`
const DataSizeExceeded = () => {
  return (
    <NoDataContainerCentered>
      <FontAwesomeIcon icon={faExclamationTriangle} />
      Insights data size is too large
      <p>
        Unable to display the insights for the selected organization filters as
        too much data is returned. Please select additional filters to limit the
        data.
      </p>
    </NoDataContainerCentered>
  )
}

export default DataSizeExceeded
