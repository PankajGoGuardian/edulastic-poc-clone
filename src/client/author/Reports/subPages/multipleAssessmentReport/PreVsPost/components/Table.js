import React from 'react'
import { flatMap, map } from 'lodash'
import PropTypes from 'prop-types'
import { Row } from 'antd'
import { StyledCard, StyledH3, StyledCell } from '../../../../common/styled'
import { downloadCSV } from '../../../../common/util'
import CsvTable from '../../../../common/components/tables/CsvTable'
import TableFilters from './filters/TableFilters'
import HorizontalStackedBarChart from '../../../../common/components/charts/HorizontalStackedBarChart'
import {
  AssessmentNameContainer,
  StyledSpan,
  StyledTable,
  ArrowDown,
  ArrowUp,
} from '../common/styled'

const getTableColumns = (
  compareBy,
  analyseBy,
  selectedPerformanceBand,
  dataSource
) => {
  const testNameColumn = (record) => (
    <Row justify="center">
      <AssessmentNameContainer>
        <StyledSpan>pre</StyledSpan> <br />
        <span>{record.preTestName}</span>
      </AssessmentNameContainer>
      <AssessmentNameContainer>
        <StyledSpan>post</StyledSpan> <br />
        <span>{record.postTestName}</span>
      </AssessmentNameContainer>
    </Row>
  )

  const AvgPerformanceColumn = (record) => {
    const {
      preBand,
      postBand,
      preAvgScore,
      postAvgScore,
      preAvgScorePercentage,
      postAvgScorePercentage,
    } = record
    return (
      <Row type="flex" justify="center">
        <StyledCell
          justify="center"
          style={{ backgroundColor: preBand.color, padding: '15px' }}
        >
          {analyseBy === 'rawScore'
            ? `${preAvgScore}`
            : `${preAvgScorePercentage}%`}
        </StyledCell>
        <StyledCell
          justify="center"
          style={{
            backgroundColor: postBand.color,
            padding: '15px',
          }}
        >
          {analyseBy === 'rawScore'
            ? `${postAvgScore}`
            : `${postAvgScorePercentage}%`}
        </StyledCell>
      </Row>
    )
  }

  const changeColumn = (record, value) => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {`${Math.abs(
        record.postAvgScorePercentage - record.preAvgScorePercentage
      )}%  `}
      {value < 0 ? <ArrowDown /> : value > 0 ? <ArrowUp /> : ''}
    </div>
  )
  const tableColumns = [
    {
      title: compareBy,
      dataIndex: 'rowTitle',
      width: 188,
      align: 'left',
    },
    {
      title: 'Students',
      width: 188,
      align: 'center',
      dataIndex: 'studentsCount',
    },
    {
      title: 'Test',
      width: 200,
      align: 'center',
      dataIndex: 'testName',
      visibleOn: ['browser'],
      render: (_, record) => {
        return testNameColumn(record)
      },
    },
    {
      title: 'Avg. Performance',
      dataIndex: 'avgScore',
      width: 188,
      align: 'center',
      visibleOn: ['browser'],
      render: (_, record) => {
        return AvgPerformanceColumn(record)
      },
    },
    {
      title: 'Avg (Pre)',
      dataIndex: 'preAvgScorePercentage',
      align: 'center',
      visibleOn: ['csv'],
    },
    {
      title: 'Avg (Pre)',
      dataIndex: 'postAvgScorePercentage',
      align: 'center',
      visibleOn: ['csv'],
    },
    {
      title: 'Change',
      width: 188,
      align: 'center',
      dataIndex: '',
      render: (_, record) => {
        const value = record.postAvgScore - record.preAvgScore
        return changeColumn(record, value)
      },
    },
    {
      title: 'Performance Band',
      width: 188,
      align: 'center',
      dataIndex: '',
      visibleOn: ['browser'],
      render: (_, record) => {
        return (
          <div>
            <HorizontalStackedBarChart
              data={[record.preBandProfile]}
              studentsCount={record.studentsCount}
              selectedPerformanceBand={selectedPerformanceBand}
              selectedAnalyseBy={analyseBy}
            />
            <HorizontalStackedBarChart
              data={[record.postBandProfile]}
              studentsCount={record.studentsCount}
              selectedPerformanceBand={selectedPerformanceBand}
              selectedAnalyseBy={analyseBy}
            />
          </div>
        )
      },
    },
  ]
  const compareByStudentFields = [
    {
      title: compareBy,
      dataIndex: 'rowTitle',
      align: 'left',
      width: 150,
    },
    {
      title: 'School',
      width: 150,
      align: 'center',
      dataIndex: 'schoolName',
    },
    {
      title: 'Teacher',
      width: 90,
      align: 'center',
      dataIndex: 'teacherName',
    },
    {
      title: 'Class',
      width: 90,
      dataIndex: 'className',
    },
    {
      title: 'Test',
      width: 90,
      align: 'center',
      dataIndex: 'testName',
      visibleOn: ['browser'],
      render: (_, record) => {
        return testNameColumn(record)
      },
    },
    {
      title: 'Avg. Performance',
      dataIndex: 'avgScore',
      width: 120,
      align: 'center',
      visibleOn: ['browser'],
      render: (_, record) => {
        return AvgPerformanceColumn(record)
      },
    },
    {
      title: 'Change',
      width: 70,
      align: 'center',
      dataIndex: '',
      render: (_, record) => {
        const value = record.postAvgScore - record.preAvgScore
        return changeColumn(record, value)
      },
    },
  ]
  const performanceBandColumns = flatMap(dataSource, (d) => {
    const { preBandProfile, postBandProfile } = d
    const preBandColumns = map(Object.keys(preBandProfile), (key) => ({
      title: key,
      dataIndex: '',
      align: 'center',
      visibleOn: ['csv'],
      render: (_, record) => record.preBandProfile[key],
    }))
    const postBandColumns = map(Object.keys(postBandProfile), (key) => ({
      title: key,
      dataIndex: '',
      align: 'center',
      visibleOn: ['csv'],
      render: (_, record) => record.postBandProfile[key],
    }))

    return [...preBandColumns, ...postBandColumns]
  })
  tableColumns.push(...performanceBandColumns)
  return compareBy === 'student' ? compareByStudentFields : tableColumns
}

const PreVsPostTable = ({
  dataSource,
  compareByOptions,
  analyseByOptions,
  rowSelection,
  selectedTableFilters,
  setTableFilters,
  handleAddToGroupClick,
  selectedPerformanceBand,
  isCsvDownloading,
  setCellBandInfo,
}) => {
  const onCsvConvert = (data) => downloadCSV(`Pre Vs Post.csv`, data)

  return (
    <StyledCard>
      <Row type="flex" justify="space-between" style={{ marginBottom: '20px' }}>
        <StyledH3>Performance trend and Change summary</StyledH3>
        <TableFilters
          setTableFilters={setTableFilters}
          compareByOptions={compareByOptions}
          analyseByOptions={analyseByOptions}
          handleAddToGroupClick={handleAddToGroupClick}
          selectedTableFilters={selectedTableFilters}
          setCellBandInfo={setCellBandInfo}
        />
      </Row>
      <CsvTable
        dataSource={dataSource}
        columns={getTableColumns(
          selectedTableFilters.compareBy.key,
          selectedTableFilters.analyseBy.key,
          selectedPerformanceBand,
          dataSource
        )}
        rowSelection={
          selectedTableFilters.compareBy.key === 'student' ? rowSelection : null
        }
        tableToRender={StyledTable}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        scroll={{ x: '100%' }}
      />
    </StyledCard>
  )
}

PreVsPostTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
}

export default PreVsPostTable
