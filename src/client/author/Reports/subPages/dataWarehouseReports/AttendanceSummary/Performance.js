import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
import { EduIf, SpinLoader, notification } from '@edulastic/common'
import CsvTable from '../../../common/components/tables/CsvTable'
import { StyledCard } from '../../../common/styled'
import TableFilters from './TableFilter'
import {
  compareByEnums,
  compareByToPluralName,
  pageSize,
} from './utils/constants'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import { StyledTable } from './styled-component'
import { getTableColumns, onCsvConvert } from './utils'

const PerformanceTable = ({
  isCsvDownloading = false,
  settings = {},
  data,
  totalRows,
  loading,
  sortOrder,
  setSortOrder,
  sortKey,
  setSortKey,
  page,
  setPage,
  compareBy,
  setCompareBy,
  isSharedReport = false,
  compareByOptions,
  showAbsents,
}) => {
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])
  const [rowSelection, checkedStudentsForModal] = useMemo(() => {
    const _rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      onSelect: (props) => {
        const {
          dimension: { _id: studentId },
        } = props
        setCheckedStudents(
          checkedStudents.includes(studentId)
            ? checkedStudents.filter((i) => i !== studentId)
            : [...checkedStudents, studentId]
        )
      },
      onSelectAll: (flag) =>
        setCheckedStudents(flag ? data.map((d) => d.dimension?._id) : []),
    }

    const _checkedStudentsForModal = data
      .filter((d) => checkedStudents.includes(d.dimension?._id))
      .map(({ dimension: { _id, name } }) => {
        const [lastName, firstName] = name.split(', ')
        return {
          _id,
          firstName,
          lastName,
        }
      })
    return [_rowSelection, _checkedStudentsForModal]
  }, [data, compareBy, sortOrder, sortKey, checkedStudents, selectedRowKeys])

  useEffect(() => {
    setPage(1)
    setSortOrder('')
    setSortKey('')
  }, [settings.requestFilters])
  const columns = useMemo(() => {
    return getTableColumns(sortOrder, sortKey, compareBy, showAbsents)
  }, [sortOrder, sortKey, compareBy, showAbsents])

  const _setCompareBy = (value) => {
    setCompareBy(value)
    setSortOrder('')
    setSortKey('')
    setPage(1)
  }
  const handleAddToGroup = () => {
    if (checkedStudentsForModal.length < 1) {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    } else {
      setShowAddToGroupModal(true)
    }
  }
  const _rowSelection =
    compareBy === compareByEnums.STUDENT && !isSharedReport
      ? rowSelection
      : null

  return (
    <StyledCard>
      <AddToGroupModal
        groupType="custom"
        visible={showAddToGroupModal}
        onCancel={() => setShowAddToGroupModal(false)}
        checkedStudents={checkedStudentsForModal}
      />
      <TableFilters
        compareByOptions={compareByOptions}
        setCompareBy={_setCompareBy}
        compareBy={compareBy}
        handleAddToGroup={handleAddToGroup}
      />
      <EduIf condition={loading}>
        <SpinLoader
          tip={`Loading ${compareByToPluralName[compareBy]} data, it may take a while`}
          height="200px"
        />
      </EduIf>
      <EduIf condition={!loading}>
        <CsvTable
          dataSource={data}
          columns={columns}
          tableToRender={StyledTable}
          rowSelection={_rowSelection}
          onCsvConvert={onCsvConvert}
          pagination={false}
          isCsvDownloading={isCsvDownloading}
          onChange={(_, __, column) => {
            setSortKey(column.columnKey)
            setSortOrder(column.order)
          }}
        />
        <EduIf condition={totalRows > pageSize}>
          <Pagination
            style={{ marginTop: '10px' }}
            onChange={setPage}
            current={page}
            pageSize={pageSize}
            total={totalRows}
          />
        </EduIf>
      </EduIf>
    </StyledCard>
  )
}

PerformanceTable.propTypes = {
  isCsvDownloading: PropTypes.bool.isRequired,
}

export default PerformanceTable
