import { Icon } from 'antd'
import React from 'react'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { ActionContainer, StyledText } from './styled'

const StatusCsvDownload = ({
  csvDownloadLoadingState,
  record,
  handleDownloadCsv,
  progressStatus,
  progressName,
  index,
  children,
  showStatusCellHyperLink,
}) => {
  const isLoading =
    csvDownloadLoadingState[`${record.testId}_${progressName}_${index}`]

  if (isLoading) {
    return <Icon type="loading" spin />
  }

  return (
    <EduIf condition={showStatusCellHyperLink}>
      <EduThen>
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(record, progressStatus, progressName, index)
          }
        >
          {children}
        </ActionContainer>
      </EduThen>
      <EduElse>
        <StyledText>{children}</StyledText>
      </EduElse>
    </EduIf>
  )
}

export default StatusCsvDownload
