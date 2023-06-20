import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { isEmpty } from 'lodash'
import { NoDataContainer } from '../../common/components/StyledComponents'
import CsvTable from '../../../../../Shared/Components/DataWarehouseUploadsTable/CsvTable'
import { StyledTable } from '../../../../../../common/styled'

const Table = ({ data, columns }) => {
  return (
    <EduIf condition={isEmpty(data)}>
      <EduThen>
        <NoDataContainer>
          No previous import, use upload button to import test data.
        </NoDataContainer>
      </EduThen>
      <EduElse>
        <CsvTable
          dataSource={data}
          columns={columns}
          tableToRender={StyledTable}
          pagination={{
            pageSize: 10,
          }}
        />
      </EduElse>
    </EduIf>
  )
}

export default Table
