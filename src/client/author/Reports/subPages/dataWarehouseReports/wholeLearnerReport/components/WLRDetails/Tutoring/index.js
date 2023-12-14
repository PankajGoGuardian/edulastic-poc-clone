import React, { useMemo } from 'react'
import { Spin } from 'antd'

import { EduIf, EduElse, EduThen } from '@edulastic/common'
import { StyledEmptyContainer } from '../../../../common/components/styledComponents'
import { getTutoringTableColumns, getTutoringTableData } from './utils'
import { StyledTable } from './styled'
import CsvTable from '../../../../../../common/components/tables/CsvTable'

export const Tutoring = ({
  data,
  loading,
  error,
  onCsvConvert,
  isCsvDownloading,
  isSharedReport,
}) => {
  const tutoringTableColumns = useMemo(
    () => getTutoringTableColumns(isSharedReport),
    [isSharedReport]
  )
  const tutoringTableData = useMemo(() => getTutoringTableData(data), [data])

  const hasContent = !loading && !error && tutoringTableData.length
  const emptyContainerDesc = error
    ? 'Sorry, you have hit an unexpected error.'
    : 'No Tutoring assigned to the Student yet.'

  return (
    <Spin spinning={loading}>
      <EduIf condition={hasContent}>
        <EduThen>
          <CsvTable
            tableToRender={StyledTable}
            dataSource={tutoringTableData}
            columns={tutoringTableColumns}
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
            pagination={false}
          />
        </EduThen>
        <EduElse>
          <StyledEmptyContainer description={emptyContainerDesc} />
        </EduElse>
      </EduIf>
    </Spin>
  )
}
