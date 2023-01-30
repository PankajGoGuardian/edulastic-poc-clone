import React from 'react'
import { flatMap, map } from 'lodash'
import PropTypes from 'prop-types'
import { Row, Typography } from 'antd'
import { darkGrey } from '@edulastic/colors'

import { downloadCSV } from '../../../../common/util'
import CsvTable from '../../../../common/components/tables/CsvTable'
import TableFilters from './filters/TableFilters'
import HorizontalStackedBarChart from './HorizontalStackedBarChart'

import { StyledCard, StyledCell, DashedLine } from '../../../../common/styled'
import {
  AssessmentNameContainer,
  StyledTable,
  ArrowSmall as Arrow,
  TestTypeTag,
  StyledRow,
} from '../common/styled'

const onCsvConvert = (data) =>
  downloadCSV(`Pre Vs Post Test Comparison.csv`, data)

// Test Column Render
const getTestName = (record) => (
  <Row justify="center">
    <AssessmentNameContainer>
      <TestTypeTag>PRE</TestTypeTag>
      <div className="test-name">{record.preTestName}</div>
    </AssessmentNameContainer>
    <AssessmentNameContainer>
      <TestTypeTag>POST</TestTypeTag>
      <div className="test-name">{record.postTestName}</div>
    </AssessmentNameContainer>
  </Row>
)

// Avg Performance column render
const getAvgPerformance = (record, analyseBy) => {
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

// change column render
const getPerformanceChange = (record) => {
  const { preAvgScorePercentage, postAvgScorePercentage } = record
  const value = postAvgScorePercentage - preAvgScorePercentage
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {`${Math.abs(value)}%  `}
      {value < 0 ? (
        <Arrow type="top" />
      ) : value > 0 ? (
        <Arrow type="bottom" />
      ) : (
        ''
      )}
    </div>
  )
}

const getTableColumns = (
  compareBy,
  analyseBy,
  selectedPerformanceBand,
  dataSource
) => {
  // table columns for all compareBy options except student
  const genericColumns = [
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
        return getTestName(record)
      },
    },
    {
      title: 'Avg. Performance',
      dataIndex: 'avgScore',
      width: 188,
      align: 'center',
      visibleOn: ['browser'],
      render: (_, record) => {
        return getAvgPerformance(record, analyseBy)
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
        return getPerformanceChange(record)
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
            />
            <HorizontalStackedBarChart
              data={[record.postBandProfile]}
              studentsCount={record.studentsCount}
              selectedPerformanceBand={selectedPerformanceBand}
            />
          </div>
        )
      },
    },
  ]

  // table columns when compareBy student is selected
  const compareByStudentColumns = [
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
        return getTestName(record)
      },
    },
    {
      title: 'Avg. Performance',
      dataIndex: 'avgScore',
      width: 120,
      align: 'center',
      visibleOn: ['browser'],
      render: (_, record) => {
        return getAvgPerformance(record)
      },
    },
    {
      title: 'Change',
      width: 70,
      align: 'center',
      dataIndex: '',
      render: (_, record) => {
        return getPerformanceChange(record)
      },
    },
  ]

  // additional performance band columns to be downloaded in csv
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
  genericColumns.push(...performanceBandColumns)

  return compareBy === 'student' ? compareByStudentColumns : genericColumns
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
  // get table columns
  const tableColumns = getTableColumns(
    selectedTableFilters.compareBy.key,
    selectedTableFilters.analyseBy.key,
    selectedPerformanceBand,
    dataSource
  )
  return (
    <StyledCard>
      <StyledRow type="flex" justify="space-between">
        <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
          Performance Change By {selectedTableFilters.compareBy.title}
        </Typography.Title>
        <DashedLine dashColor={darkGrey} />
        <TableFilters
          setTableFilters={setTableFilters}
          compareByOptions={compareByOptions}
          analyseByOptions={analyseByOptions}
          handleAddToGroupClick={handleAddToGroupClick}
          selectedTableFilters={selectedTableFilters}
          setCellBandInfo={setCellBandInfo}
        />
      </StyledRow>
      <CsvTable
        dataSource={dataSource}
        columns={tableColumns}
        rowSelection={
          selectedTableFilters.compareBy.key === 'student' ? rowSelection : null
        }
        tableToRender={StyledTable}
        pagination={{ hideOnSinglePage: true, pageSize: 25 }}
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
