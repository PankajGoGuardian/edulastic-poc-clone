import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'antd'
import { darkGrey } from '@edulastic/colors'

import { notification } from '@edulastic/common'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import TableFilters from '../filters/TableFilters'

import { StyledCard, DashedLine } from '../../../../../common/styled'
import {
  StyledTable,
  StyledRow,
} from '../../../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import { getTableColumns, onCsvConvert } from './utils'
import IncompleteTestsMessage from '../../../../../common/components/IncompleteTestsMessage'
import { TABLE_PAGE_SIZE, analyseByOptions } from '../../utils'
import FeaturesSwitch from '../../../../../../../features/components/FeaturesSwitch'
import AddToGroupModal from '../../../../../common/components/Popups/AddToGroupModal'
import useTableMetrics from '../../hooks/useTableMetrics'
import { addStudentToGroupFeatureEnabled } from '../../../../multipleAssessmentReport/PreVsPost/utils'

const EfficacyTable = ({
  reportTableData,
  testInfo,
  prePerformanceBand,
  postPerformanceBand,
  tableFilters,
  compareByOptions,
  selectedTableFilters,
  setTableFilters,
  isCsvDownloading,
  isSharedReport = false,
  hasIncompleteTests,
}) => {
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])

  const [
    tableData = [],
    rowSelection = [],
    checkedStudentsForModal = [],
  ] = useTableMetrics({
    reportTableData,
    prePerformanceBand,
    postPerformanceBand,
    tableFilters,
    selectedRowKeys,
    onSelectChange,
    checkedStudents,
    setCheckedStudents,
    testInfo,
  })

  // Handle add to student group
  const handleAddToGroupClick = () => {
    if (checkedStudentsForModal.length) {
      setShowAddToGroupModal(true)
    } else {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    }
  }

  const _rowSelection = addStudentToGroupFeatureEnabled(
    selectedTableFilters.compareBy.key,
    isSharedReport
  )
    ? rowSelection
    : null

  // get table columns
  const tableColumns = getTableColumns(
    selectedTableFilters.compareBy,
    selectedTableFilters.analyseBy.key,
    testInfo
  )

  return (
    <StyledCard>
      <FeaturesSwitch
        inputFeatures="studentGroups"
        actionOnInaccessible="hidden"
      >
        <AddToGroupModal
          groupType="custom"
          visible={showAddToGroupModal}
          onCancel={() => setShowAddToGroupModal(false)}
          checkedStudents={checkedStudentsForModal}
        />
      </FeaturesSwitch>
      <StyledRow type="flex" justify="space-between" margin="20px">
        <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
          Performance Change By {selectedTableFilters.compareBy.title}
        </Typography.Title>
        <DashedLine margin="15px 24px" dashColor={darkGrey} />
        <TableFilters
          setTableFilters={setTableFilters}
          compareByOptions={compareByOptions}
          analyseByOptions={analyseByOptions}
          handleAddToGroupClick={handleAddToGroupClick}
          selectedTableFilters={selectedTableFilters}
          isSharedReport={isSharedReport}
        />
      </StyledRow>
      <CsvTable
        dataSource={tableData}
        columns={tableColumns}
        rowSelection={_rowSelection}
        tableToRender={StyledTable}
        pagination={{ hideOnSinglePage: true, pageSize: TABLE_PAGE_SIZE }}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        scroll={{ x: '100%' }}
      />
      <StyledRow type="flex" align="middle">
        <IncompleteTestsMessage hasIncompleteTests={hasIncompleteTests} />
      </StyledRow>
    </StyledCard>
  )
}

EfficacyTable.propTypes = {
  isCsvDownloading: PropTypes.bool.isRequired,
}

export default EfficacyTable
