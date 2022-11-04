import React from 'react'
import next from 'immer'
import { Row } from 'antd'
import TableFilters from '../filters/TableFilters'
import { TableContainer, CustomStyledTable } from '../styled'
import CsvTable from '../../../../../common/components/tables/CsvTable'

const tableColumnsData = [
  {
    dataIndex: 'compareBy',
    key: 'compareBy',
    align: 'left',
    fixed: 'left',
    width: 200,
  },
  // next up are dynamic columns for each assessment
]

const compareByMap = {
  school: 'schoolName',
  teacher: 'teacherName',
  group: 'groupName',
  student: 'studentName',
  race: 'race',
  gender: 'gender',
  ellStatus: 'ellStatus',
  iepStatus: 'iepStatus',
  frlStatus: 'frlStatus',
  standard: 'standard',
  hispanicEthnicity: 'hispanicEthnicity',
}

const getTableColumns = (tableData, ratingsData, selectedTableFilters) => {
  const compareBy = selectedTableFilters.compareBy
  return next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByIdx = _columns.findIndex((col) => col.key === 'compareBy')
    _columns[compareByIdx].title = compareBy.title
    _columns[compareByIdx].dataIndex = compareByMap[compareBy.key]
    _columns[compareByIdx].render = (data) => data || '-'
    _columns[compareByIdx].sorter = (a, b) => {
      const dataIndex = compareByMap[compareBy.key]
      return (a[dataIndex] || '')
        .toLowerCase()
        .localeCompare((b[dataIndex] || '').toLowerCase())
    }
    _columns[compareByIdx].defaultSortOrder = 'ascend'

    const ratingColumns = ratingsData.flatMap((rating) => {
      return {
        key: rating.id,
        title: (
          <div>
            <h4>{rating.rubric.name}</h4>
            <h4>{rating.criteria.name}</h4>
            <h4>{rating.avgScore}</h4>
          </div>
        ),
        align: 'center',
        dataIndex: 'ratings',
        visibleOn: ['browser'],
        render: (ratings = {}) => {
          const currentRating = ratings.find((r) => r.id === rating.id)
          if (currentRating) {
            return currentRating ? (
              <Row type="flex" justify="center">
                <p>{currentRating.avgScorePercentage}</p>
              </Row>
            ) : (
              '-'
            )
          }
        },
      }
    })
    _columns.push(...ratingColumns)
  })
}

const PerformanceByRubricCriteriaTable = ({
  tableData,
  selectedTableFilters,
  setTableFilters,
  tableFilterOptions,
}) => {
  const tableColumns = getTableColumns(tableData)
  return (
    <>
      <TableFilters
        setTableFilters={setTableFilters}
        compareByOptions={tableFilterOptions.compareByData}
        analyseByOptions={tableFilterOptions.analyseByData}
        selectedTableFilters={selectedTableFilters}
      />
      <TableContainer>
        <CsvTable
          dataSource={tableData}
          columns={tableColumns}
          tableToRender={CustomStyledTable}
          onCsvConvert={() => {}}
          isCsvDownloading={() => {}}
        />
      </TableContainer>
    </>
  )
}

export default PerformanceByRubricCriteriaTable
