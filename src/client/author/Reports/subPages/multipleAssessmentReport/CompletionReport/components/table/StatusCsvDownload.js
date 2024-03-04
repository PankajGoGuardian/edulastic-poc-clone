import { Icon } from 'antd'
import React from 'react'
import { ActionContainer } from './styled'

const StatusCsvDownload = ({
  csvDownloadLoadingState,
  record,
  handleDownloadCsv,
  progressStatus,
  progressName,
  index,
  children,
}) => {
  const isLoading =
    csvDownloadLoadingState[`${record.testId}_${progressName}_${index}`]

  if (isLoading) {
    return <Icon type="loading" spin />
  }
  return (
    <ActionContainer
      onClick={() =>
        handleDownloadCsv(record, progressStatus, progressName, index)
      }
    >
      {children}
    </ActionContainer>
  )
}

export default StatusCsvDownload
