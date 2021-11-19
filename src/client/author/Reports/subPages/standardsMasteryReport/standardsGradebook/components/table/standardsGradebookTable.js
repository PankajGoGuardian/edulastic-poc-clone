/* eslint-disable array-callback-return */
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Tooltip } from 'antd'
import { isEmpty, map, filter, flatMap, uniqBy } from 'lodash'
import styled from 'styled-components'
import next from 'immer'
import { withNamespaces } from '@edulastic/localization'

import { IconInfo } from '@edulastic/icons'
import { extraDesktopWidthMax } from '@edulastic/colors'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'

import { StyledTable, StyledDropDownContainer } from '../styled'
import { StyledH3, StyledCard, ColoredCell } from '../../../../../common/styled'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'

import CsvTable from '../../../../../common/components/tables/CsvTable'
import { downloadCSV } from '../../../../../common/util'

import {
  getTableData,
  getMasteryDropDown,
  idToName,
  analyseByToKeyToRender,
  analyseByToName,
  getStandardProgressNav,
} from '../../utils/transformers'

import dropDownFormat from '../../static/json/dropDownFormat.json'
import { reportLinkColor } from '../../../../multipleAssessmentReport/common/utils/constants'

export const GradebookTable = styled(StyledTable)`
  .ant-table-layout-fixed {
    .ant-table-scroll {
      table tbody tr td {
        border-bottom: 1px solid #e9e9e9;
      }
      .ant-table-body {
        overflow-x: auto !important;
      }
      @media print {
        .ant-table-body {
          overflow-x: hidden !important;
        }
      }
    }
    .ant-table-fixed-left {
      .ant-table-thead {
        th {
          padding: 8px;
          color: #aaafb5;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 10px;
          border: 0px;
          .ant-table-column-sorter {
            vertical-align: top;
          }
        }
      }
      .ant-table-tbody {
        td {
          padding: 10px 0px 10px 8px;
          font-size: 11px;
          color: #434b5d;
          font-weight: 600;
          @media (min-width: ${extraDesktopWidthMax}) {
            font-size: 14px;
          }
        }
      }
    }
  }
`

const compareByStudentsColumns = [
  {
    title: 'SIS ID',
    dataIndex: 'sisId',
    width: 150,
    key: 'sisId',
    visibleOn: ['csv'],
  },
  {
    title: 'STUDENT NUMBER',
    dataIndex: 'studentNumber',
    width: 150,
    key: 'studentNumber',
    visibleOn: ['csv'],
  },
]

const getStandardColumnAverage = (analyseBy, standardsData, standardId) => {
  const standard = standardsData.find((s) => s.standardId === standardId)
  return analyseBy === 'score(%)' ? `${standard.score}%` : standard[analyseBy]
}

const getStandardColumnValue = (item, analyseBy) => {
  let colValue = ''
  if (!item) {
    colValue = 'N/A'
  } else if (analyseBy === 'score(%)') {
    colValue = `${item.scorePercent}%`
  } else if (analyseBy === 'rawScore') {
    colValue = `${item.totalTotalScore.toFixed(2)}/${item.totalMaxScore}`
  } else if (analyseBy === 'masteryLevel') {
    colValue = item.masteryName
  } else if (analyseBy === 'masteryScore') {
    colValue = item.fm.toFixed(2)
  }
  return colValue
}

const getStandardColumnRender = (
  t,
  compareBy,
  standardId,
  standardName,
  filters,
  handleOnClickStandard
) => (data, record) => {
  const standardToRender = record.standardsInfo.find(
    (std) => std.standardId === standardId
  )
  const bgColor =
    (record.analyseBy === 'masteryLevel' ||
      record.analyseBy === 'masteryScore') &&
    standardToRender?.color
  // colValue is 'N/A', if standardToRender is undefined
  const colValue = getStandardColumnValue(standardToRender, record.analyseBy)

  const tooltipText = (
    <div>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">{idToName[compareBy]}: </Col>
        <Col className="custom-table-tooltip-value">
          {record.compareByLabel || t('common.anonymous')}
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">Standard: </Col>
        <Col className="custom-table-tooltip-value">{standardName}</Col>
      </Row>
      <Row type="flex" justify="start">
        <Col className="custom-table-tooltip-key">
          {analyseByToName[record.analyseBy]}:{' '}
        </Col>
        <Col className="custom-table-tooltip-value">{colValue}</Col>
      </Row>
    </div>
  )

  const filtersObj = {
    termId: filters.termId,
    studentId: record.studentId,
    standardId,
    profileId: filters.profileId,
    assessmentTypes:
      filters.assessmentTypes !== 'All' ? filters.assessmentTypes : '',
  }
  const handleOnClick = () =>
    compareBy === 'studentId' && standardToRender
      ? handleOnClickStandard(filtersObj, standardName, record.compareByLabel)
      : null

  return (
    <CustomTableTooltip
      placement="top"
      title={tooltipText}
      getCellContents={() => (
        <ColoredCell bgColor={bgColor} onClick={handleOnClick}>
          {colValue}
        </ColoredCell>
      )}
    />
  )
}

const getColumnSorter = (standardId) => (a, b) => {
  // sort by score(%), if analyseBy rawScore / score(%)
  // sort by masteryScore, if analyseBy masteryScore / masteryLevel
  // use augmented analyseBy for sorter (same for all records)
  const _analyseBy =
    a.analyseBy === 'rawScore'
      ? 'score(%)'
      : a.analyseBy === 'masteryLevel'
      ? 'masteryScore'
      : a.analyseBy
  const _analyseByKey = analyseByToKeyToRender[_analyseBy]

  // result for avg. standard performance
  const colAvgA = a[_analyseByKey]
  const colAvgB = b[_analyseByKey]
  let result = (parseFloat(colAvgA) || 0) - (parseFloat(colAvgB) || 0)

  // for avg. performance column, standardId is undefined
  if (standardId) {
    const colValueA = getStandardColumnValue(
      a.standardsInfo.find((std) => std.standardId === standardId),
      _analyseBy
    )
    const colValueB = getStandardColumnValue(
      b.standardsInfo.find((std) => std.standardId === standardId),
      _analyseBy
    )
    // for result, consider 'N/A' as -1 (lower precedence than 0)
    const _result =
      (colValueA === 'N/A' ? -1 : parseFloat(colValueA) || 0) -
      (colValueB === 'N/A' ? -1 : parseFloat(colValueB) || 0)
    // for standard column, if values are equal, sort by avg. performance column
    result = _result || result
  }

  return result
}

const StandardsGradebookTableComponent = ({
  filteredDenormalizedData,
  masteryScale,
  chartFilter,
  isCsvDownloading,
  role,
  filters = {},
  handleOnClickStandard,
  standardsData,
  location,
  navigationItems,
  pageTitle,
  isSharedReport,
  t,
}) => {
  const [tableDdFilters, setTableDdFilters] = useState({
    masteryLevel: 'all',
    analyseBy: 'masteryScore',
    compareBy: role === 'teacher' ? 'studentId' : 'schoolId',
  })

  const [prevMasteryScale, setPrevMasteryScale] = useState(null)

  if (prevMasteryScale !== masteryScale) {
    const masteryDropDownData = getMasteryDropDown(masteryScale)
    setPrevMasteryScale(masteryScale)
    setTableDdFilters({
      ...tableDdFilters,
      masteryLevel: masteryDropDownData[0].key,
    })
  }

  const augmentedTableData = useMemo(() => {
    const tableData = getTableData(
      filteredDenormalizedData,
      masteryScale,
      tableDdFilters.compareBy,
      tableDdFilters.masteryLevel
    )
    // augment analyseBy to tableData records for conditional sorting
    return map(tableData, (record) => ({
      ...record,
      analyseBy: tableDdFilters.analyseBy,
    }))
  }, [filteredDenormalizedData, masteryScale, tableDdFilters])

  const selectedStandards = filter(
    // one standardsInfo record for each standard id
    uniqBy(
      flatMap(augmentedTableData, ({ standardsInfo }) => standardsInfo),
      'standardId'
    ),
    // filter standardsInfo for selected standard ids
    (s) => chartFilter[s.standardName] || isEmpty(chartFilter)
  )

  const columns = [
    {
      title: idToName[tableDdFilters.compareBy],
      dataIndex: tableDdFilters.compareBy,
      key: tableDdFilters.compareBy,
      width: 200,
      fixed: 'left',
      sorter: (a, b) =>
        a.compareByLabel
          .toLowerCase()
          .localeCompare(b.compareByLabel.toLowerCase()),
      render: (data, record) =>
        record.compareBy === 'studentId' && !isSharedReport ? (
          <Link
            to={`/author/reports/student-profile-summary/student/${data}?termId=${filters?.termId}`}
          >
            {record.compareByLabel || t('common.anonymous')}
          </Link>
        ) : (
          record.compareByLabel || t('common.anonymous')
        ),
    },
    {
      title: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <span>Avg. Standard Performance</span>
          <Tooltip title="This is the average performance across all the standards assessed">
            <IconInfo height={10} />
          </Tooltip>
        </div>
      ),
      dataIndex: analyseByToKeyToRender[tableDdFilters.analyseBy],
      key: analyseByToKeyToRender[tableDdFilters.analyseBy],
      width: 150,
      render: (data, record) => {
        const dataToRender =
          tableDdFilters.analyseBy === 'score(%)'
            ? `${data}%`
            : tableDdFilters.analyseBy === 'rawScore'
            ? `${data}/${record.totalMaxScore}`
            : data
        return !isSharedReport ? (
          <Link
            style={{ color: reportLinkColor }}
            to={{
              pathname: `/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${record.testActivityId}`,
              state: {
                // this will be consumed in /src/client/author/Shared/Components/ClassBreadCrumb.js
                breadCrumb: [
                  {
                    title: 'INSIGHTS',
                    to: '/author/reports',
                  },
                  {
                    title: pageTitle,
                    to: `${location.pathname}${location.search}`,
                  },
                ],
              },
            }}
          >
            {dataToRender}
          </Link>
        ) : (
          dataToRender
        )
      },
      sorter: getColumnSorter(),
    },
    // standard columns
    ...map(selectedStandards, (item) => {
      const standardProgressNav = !isSharedReport
        ? getStandardProgressNav(
            navigationItems,
            item.standardId,
            tableDdFilters.compareBy
          )
        : null
      const standardColumnAverage = getStandardColumnAverage(
        tableDdFilters.analyseBy,
        standardsData,
        item.standardId
      )
      const titleComponent = (
        <>
          <span>{item.standardName}</span>
          <br />
          <span>{standardColumnAverage}</span>
        </>
      )
      return {
        title: standardProgressNav ? (
          <Link to={standardProgressNav}>{titleComponent}</Link>
        ) : (
          titleComponent
        ),
        dataIndex: item.standardId,
        key: item.standardId,
        align: 'center',
        render: getStandardColumnRender(
          t,
          tableDdFilters.compareBy,
          item.standardId,
          item.standardName,
          filters,
          handleOnClickStandard
        ),
        sorter: getColumnSorter(item.standardId),
      }
    }),
  ]

  // for compare by student, insert student info columns to table
  if (tableDdFilters.compareBy === 'studentId') {
    let index = 1
    for (const column of compareByStudentsColumns) {
      columns.splice(index++, 0, column)
    }
  }

  // x-axis scroll length for visible columns
  const scrollX =
    filter(columns, (column) => !column.visibleOn).length * 180 || '100%'

  const compareByDropDownData = useMemo(
    () =>
      next(dropDownFormat.compareByDropDownData, (arr) => {
        if (role === 'teacher') {
          arr.splice(0, 2)
        }
      }),
    [role]
  )

  const tableFilterDropDownCB = (event, _selected, comData) => {
    if (comData === 'compareBy') {
      setTableDdFilters({
        ...tableDdFilters,
        compareBy: _selected.key,
      })
    } else if (comData === 'analyseBy') {
      setTableDdFilters({
        ...tableDdFilters,
        analyseBy: _selected.key,
      })
    }
  }

  const onCsvConvert = (data) => downloadCSV(`Standard Grade Book.csv`, data)

  return (
    <>
      <StyledCard>
        <Row type="flex" justify="start">
          <Col xs={24} sm={24} md={10} lg={10} xl={12}>
            <StyledH3>
              Standards Mastery By {idToName[tableDdFilters.compareBy]}
            </StyledH3>
          </Col>
          <Col xs={24} sm={24} md={14} lg={14} xl={12}>
            <Row className="control-dropdown-row">
              <StyledDropDownContainer xs={24} sm={24} md={11} lg={11} xl={8}>
                <ControlDropDown
                  data={compareByDropDownData}
                  by={tableDdFilters.compareBy}
                  prefix="Compare By"
                  selectCB={tableFilterDropDownCB}
                  comData="compareBy"
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer xs={24} sm={24} md={12} lg={12} xl={8}>
                <ControlDropDown
                  data={dropDownFormat.analyseByDropDownData}
                  by={tableDdFilters.analyseBy}
                  prefix="Analyze By"
                  selectCB={tableFilterDropDownCB}
                  comData="analyseBy"
                />
              </StyledDropDownContainer>
            </Row>
          </Col>
        </Row>
        <Row>
          <CsvTable
            columns={columns}
            dataSource={augmentedTableData}
            rowKey={tableDdFilters.compareBy}
            tableToRender={GradebookTable}
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
            scroll={{ x: scrollX }}
          />
        </Row>
      </StyledCard>
    </>
  )
}

export const StandardsGradebookTable = withNamespaces('student')(
  StandardsGradebookTableComponent
)
