import React, { useMemo } from 'react'
import next from 'immer'
import qs from 'qs'
import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'

import { reportUtils } from '@edulastic/constants'

import BackendPagination from '../../../../../common/components/BackendPagination'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import {
  StyledH3,
  ColoredCell,
  StyledDropDownContainer,
} from '../../../../../common/styled'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import TableTooltipRow from '../../../../../common/components/tooltip/TableTooltipRow'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { GradebookTable as StyledTable } from '../../../standardsGradebook/components/styled'

import {
  getTableData,
  getMasteryScoreColor,
  getColValue,
  getOverallColSorter,
  getOverallValue,
} from '../../utils/transformers'

const { downloadCSV } = reportUtils.common
const { getAnalyseByTitle } = reportUtils.standardsPerformanceSummary

const compareByStudentsColumns = [
  {
    title: 'SIS ID',
    dataIndex: 'sisId',
    key: 'sisId',
    visibleOn: ['csv'],
    render: (_, record) => record.rowInfo[0]?.sisId || '',
  },
  {
    title: 'STUDENT NUMBER',
    dataIndex: 'studentNumber',
    key: 'studentNumber',
    visibleOn: ['csv'],
    render: (_, record) => record.rowInfo[0]?.studentNumber || '',
  },
]

const StandardsProgressTable = ({
  data: rawTableData = [],
  testInfo,
  masteryScale,
  tableFilters,
  setTableFilters,
  tableFilterOptions,
  isCsvDownloading,
  backendPagination,
  setBackendPagination,
  filters,
  isSharedReport,
}) => {
  const { analyseByData, compareByData } = tableFilterOptions

  const [tableData, testInfoEnhanced] = useMemo(
    () =>
      getTableData(
        rawTableData,
        testInfo,
        masteryScale,
        tableFilters.compareBy.key
      ),
    [rawTableData, tableFilters]
  )

  const scrollX = useMemo(() => testInfoEnhanced?.length * 160 || '100%', [
    testInfoEnhanced?.length,
  ])

  const getTestCols = () =>
    testInfoEnhanced.map((test) => ({
      title: (
        <>
          <span>{test.testName}</span>
          <br />
          <span>
            {test[tableFilters.analyseBy.key]}
            {tableFilters.analyseBy.key === 'score' ? ' %' : ''}
          </span>
        </>
      ),
      align: 'center',
      dataIndex: test.reportKey,
      key: test.reportKey,
      render: (_, record) => {
        const _test = record.records.find((o) => o.reportKey === test.reportKey)
        const colValue = getColValue(
          _test,
          tableFilters.analyseBy.key,
          masteryScale
        )
        const bgColor =
          (tableFilters.analyseBy.key === 'masteryLevel' ||
            tableFilters.analyseBy.key === 'masteryScore') &&
          getMasteryScoreColor(_test, masteryScale)
        const toolTipText = (
          <div>
            <TableTooltipRow
              title={`${tableFilters.compareBy.title}: `}
              value={record.name || '-'}
            />
            <TableTooltipRow title="Test: " value={test.testName} />
            <TableTooltipRow
              title={`${getAnalyseByTitle(tableFilters.analyseBy.key)}: `}
              value={colValue}
            />
          </div>
        )
        return (
          <CustomTableTooltip
            placement="top"
            title={toolTipText}
            getCellContents={() =>
              colValue === 'N/A' ? (
                colValue
              ) : (
                <ColoredCell bgColor={bgColor}>{colValue}</ColoredCell>
              )
            }
          />
        )
      },
    }))

  const columns = [
    {
      title: tableFilters.compareBy.title,
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      render: (data, record) => {
        const { termId, grades, subjects, classIds, courseId } = filters
        const queryStr = qs.stringify({
          termId,
          grades,
          subjects,
          classIds,
          courseIds: courseId,
        })
        return tableFilters.compareBy.key === 'student' && !isSharedReport ? (
          <Link
            to={`/author/reports/student-progress-profile/student/${record.id}?${queryStr}`}
          >
            {data || '-'}
          </Link>
        ) : (
          data || '-'
        )
      },
    },
    ...(tableFilters.compareBy.key === 'student'
      ? compareByStudentsColumns
      : []),
    {
      title: 'Overall',
      dataIndex: 'overall',
      key: 'overall',
      width: 100,
      sorter: getOverallColSorter(tableFilters.analyseBy.key, masteryScale),
      render: (_, record) =>
        getOverallValue(record, tableFilters.analyseBy.key, masteryScale),
    },
    ...getTestCols(),
  ]

  const onChangeTableFilters = (prefix, options, selectedPayload) => {
    const modifiedState = next(tableFilters, (draft) => {
      draft[prefix] =
        options.find((option) => option.key === selectedPayload.key) ||
        options[0]
    })
    setTableFilters(modifiedState)
  }

  const bindOnChange = (prefix, options) => (props) =>
    onChangeTableFilters(prefix, options, props)

  const onCsvConvert = (data) =>
    downloadCSV(`Standard Mastery Over Time.csv`, data)

  return (
    <>
      <Row type="flex" justify="start">
        <Col xs={24} sm={24} md={12} lg={12} xl={16}>
          <StyledH3>
            Standard Mastery Over Time by {tableFilters.compareBy.title}
          </StyledH3>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Row className="control-dropdown-row">
            <StyledDropDownContainer
              data-cy="compareBy"
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
            >
              <ControlDropDown
                prefix="Compare by "
                data={compareByData}
                by={tableFilters.compareBy}
                selectCB={bindOnChange('compareBy', compareByData)}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer
              data-cy="analyzeBy"
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
            >
              <ControlDropDown
                prefix="Analyze by "
                data={analyseByData}
                by={tableFilters.analyseBy}
                selectCB={bindOnChange('analyseBy', analyseByData)}
              />
            </StyledDropDownContainer>
          </Row>
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col span={24}>
          <CsvTable
            dataSource={tableData}
            columns={columns}
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
            tableToRender={StyledTable}
            scroll={{ x: scrollX }}
          />
        </Col>
        <Col span={24}>
          <BackendPagination
            backendPagination={backendPagination}
            setBackendPagination={setBackendPagination}
          />
        </Col>
      </Row>
    </>
  )
}

export default StandardsProgressTable
