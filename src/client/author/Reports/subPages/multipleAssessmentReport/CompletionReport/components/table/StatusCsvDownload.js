import { Icon } from 'antd'
import React from 'react'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
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
    <EduIf condition={/^(0|0%)$/.test(children)}>
      <EduThen>
        <span style={{ color: '#555555', fontSize: '14px' }}>{children}</span>
      </EduThen>
      <EduElse>
        <ActionContainer
          onClick={() =>
            handleDownloadCsv(record, progressStatus, progressName, index)
          }
        >
          {children}
        </ActionContainer>
      </EduElse>
    </EduIf>
  )
}

export default StatusCsvDownload
