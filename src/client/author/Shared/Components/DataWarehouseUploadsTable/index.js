import React, { useMemo } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Tag, Tooltip, Icon } from 'antd'
import { isEmpty, get } from 'lodash'
import { red, green, yellow, fadedBlack } from '@edulastic/colors'

import { getOrgDataSelector } from '../../../src/selectors/user'
import CsvTable from './CsvTable'
import { StyledTable } from '../../../../common/styled'
import { getTableColumns } from './utils'

const getTag = (status, statusReason = '') => {
  if (status === 'SUCCESS') {
    return <Tag color={green}>Success</Tag>
  }
  if (status === 'ERROR') {
    return (
      <>
        <Tag color={red}>Failed</Tag>
        <Tooltip title={statusReason}>
          <StyledIcon type="warning" theme="filled" />
        </Tooltip>
      </>
    )
  }
  return <Tag color={yellow}>In Progress</Tag>
}

const DataWarehouseUploadsTable = ({ uploadsStatusList, terms }) => {
  const termsMap = useMemo(
    () =>
      new Map(
        terms.map(({ _id, name, startDate }) => [_id, { name, startDate }])
      ),
    [terms]
  )

  const sortedData = useMemo(() => {
    return uploadsStatusList.sort((a, b) => b.updatedAt - a.updatedAt)
  }, [uploadsStatusList])

  const columns = getTableColumns(termsMap, getTag)

  if (isEmpty(uploadsStatusList)) {
    return (
      <NoDataContainer>
        No previous import, use upload button to import test data.
      </NoDataContainer>
    )
  }

  return (
    <CsvTable
      dataSource={sortedData}
      columns={columns}
      tableToRender={StyledTable}
      scroll={{ x: '100%' }}
      pagination={{
        pageSize: 10,
      }}
    />
  )
}

const withConnect = connect((state) => ({
  terms: get(getOrgDataSelector(state), 'terms', []),
}))

export default compose(withConnect)(DataWarehouseUploadsTable)

const StyledIcon = styled(Icon)`
  font-size: 15px;
  cursor: pointer;
  color: ${red};
`

const NoDataContainer = styled.div`
  background: white;
  color: ${fadedBlack};
  margin-top: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ fontSize }) => fontSize || '25px'};
  font-weight: 700;
  text-align: 'center';
`
