import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
import { reportUtils } from '@edulastic/constants'
import { EduIf, SpinLoader, notification } from '@edulastic/common'
import CsvTable from '../../../common/components/tables/CsvTable'
import { StyledCard } from '../../../common/styled'
import TableFilters from './TableFilter'
import {
  StudentBand,
  HorizontalStackedBarChart,
} from './HorizontalStackedChart'
import {
  compareByEnums,
  compareByToPluralName,
  pageSize,
  sortKeys,
} from './utils/constants'
import { compareByKeysToFilterKeys, nextCompareByKeys } from '../common/utils'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import { StyledTable } from './styled-component'
import LinkCell from '../common/components/LinkCell'
import { DW_WLR_REPORT_URL } from '../../../common/constants/dataWarehouseReports'

const { downloadCSV } = reportUtils.common

const getTableColumns = (sortOrder, sortKey, compareBy) => {
  let attendanceDistributionColumn = {
    title: 'ATTENDANCE DISTRIBUTION',
    key: 'attendanceDistribution',
    align: 'center',
    dataIndex: 'attendanceDistribution',
    render: (attendanceDistribution) => {
      return <HorizontalStackedBarChart data={attendanceDistribution} />
    },
  }
  if (compareBy === compareByEnums.STUDENT) {
    attendanceDistributionColumn = {
      title: 'ATTENDANCE BAND',
      key: 'studentBand',
      align: 'center',
      dataIndex: 'studentBand',
      render: (studentBand) => {
        return <StudentBand data={studentBand} />
      },
    }
  }
  const studentsColumn = {
    title: 'NO. OF STUDENTS',
    key: sortKeys.STUDENTS,
    align: 'center',
    dataIndex: 'students',
    sorter: true,
  }
  const tableColumns = [
    {
      title: compareByToPluralName[compareBy],
      key: sortKeys.DIMENSION,
      dataIndex: 'dimension.name',
      align: 'left',
      sorter: true,
      render: (value, record) => {
        const disableDrillDown =
          compareBy === compareByEnums.TEACHER && record.students > 100
        let url = null
        const isStudentCompareBy = compareBy === compareByEnums.STUDENT
        if (!disableDrillDown) {
          if (isStudentCompareBy) {
            const { search } = window.location
            Object.assign(search, {
              courseIds: search.courseId,
              testTypes: search.assessmentTypes,
              performanceBandProfileId: search.profileId,
            })
            url = new URL(
              `${window.location.origin}${DW_WLR_REPORT_URL}${record.dimension._id}?${search}`
            )
          } else {
            const filterField = compareByKeysToFilterKeys[compareBy]
            url = new URL(window.location.href)
            url.searchParams.set(filterField, record.dimension._id)
            url.searchParams.set(
              'selectedCompareBy',
              nextCompareByKeys[compareBy]
            )
          }
        }
        return (
          <LinkCell
            value={{ _id: record.dimension._id, name: value }}
            url={url}
            openNewTab={isStudentCompareBy}
          />
        )
      },
    },
    studentsColumn,
    {
      title: 'AVG ATTENDANCE',
      key: sortKeys.ATTENDANCE,
      align: 'center',
      dataIndex: 'avgAttendance',
      render: (text) => `${Math.round(text)}%`,
      sorter: true,
    },
    {
      title: 'TOTAL ATTENDANCE / TOTAL EVENTS',
      key: sortKeys.ATTENDANCE_EVENTS,
      align: 'center',
      dataIndex: 'totalEvents',
      sorter: true,
      render: (_, record) => {
        return `${record.totalAttendance} / ${record.totalEvents}`
      },
    },
    {
      title: 'TARDIES',
      key: sortKeys.TARDIES,
      align: 'center',
      dataIndex: 'tardyEventCount',
      sorter: true,
    },
    attendanceDistributionColumn,
  ]
  return tableColumns
    .filter((item) => {
      if (compareBy === compareByEnums.STUDENT) {
        return item.dataIndex !== studentsColumn.dataIndex
      }
      return true
    })
    .map((item) => {
      if (item.key === sortKey) {
        item.sortOrder = sortOrder
      }
      return item
    })
}

export const onCsvConvert = (data) =>
  downloadCSV(`Attendance Summary.csv`, data)

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
    return getTableColumns(sortOrder, sortKey, compareBy)
  }, [sortOrder, sortKey, compareBy])

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
