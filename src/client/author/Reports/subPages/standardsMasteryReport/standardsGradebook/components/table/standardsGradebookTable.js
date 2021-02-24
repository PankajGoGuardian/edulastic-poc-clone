/* eslint-disable array-callback-return */
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'
import { isEmpty, flatMap, keyBy } from 'lodash'
import styled from 'styled-components'
import next from 'immer'
import { withNamespaces } from '@edulastic/localization'

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

  const tableData = useMemo(
    () =>
      getTableData(
        filteredDenormalizedData,
        masteryScale,
        tableDdFilters.compareBy,
        tableDdFilters.masteryLevel
      ),
    [filteredDenormalizedData, masteryScale, tableDdFilters]
  )

  const getCurrentStandard = (standardId, analyseBy) => {
    const currentStandard = standardsData.find(
      (s) => s.standardId === standardId
    )
    if (analyseBy === 'score(%)') return `${currentStandard.score}%`
    return currentStandard[analyseBy]
  }

  const getFilteredTableData = () =>
    next(tableData, (arr) => {
      arr.map((item) => {
        const tempArr = item.standardsInfo.filter((_item) => {
          if (chartFilter[_item.standardName] || isEmpty(chartFilter)) {
            return {
              ..._item,
            }
          }
        })
        item.standardsInfo = tempArr
      })
    })

  const filteredTableData = getFilteredTableData()

  const getDisplayValue = (item, _analyseBy) => {
    let printData
    if (!item) {
      return 'N/A'
    }

    if (_analyseBy === 'score(%)') {
      printData = `${item.scorePercent}%`
    } else if (_analyseBy === 'rawScore') {
      printData = `${item.totalTotalScore.toFixed(2)}/${item.totalMaxScore}`
    } else if (_analyseBy === 'masteryLevel') {
      printData = item.masteryName
    } else if (_analyseBy === 'masteryScore') {
      printData = item.fm.toFixed(2)
    }
    return printData
  }

  const renderStandardIdColumns = (
    index,
    _compareBy,
    _analyseBy,
    standardName,
    standardId
  ) => (data, record) => {
    const standardToRender =
      record.standardsInfo[index]?.standardId === standardId
        ? record.standardsInfo[index]
        : record.standardsInfo.find((std) => std.standardId === standardId)
    const tooltipText = (
      <div>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">
            {idToName[_compareBy]}:{' '}
          </Col>
          <Col className="custom-table-tooltip-value">
            {record.compareByLabel}
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Standard: </Col>
          <Col className="custom-table-tooltip-value">
            {standardToRender?.standardName}
          </Col>
        </Row>

        <Row type="flex" justify="start">
          <Col className="custom-table-tooltip-key">
            {analyseByToName[_analyseBy]}:{' '}
          </Col>
          {_analyseBy === 'rawScore' ? (
            <Col className="custom-table-tooltip-value">
              {standardToRender?.totalTotalScore}/
              {standardToRender?.totalMaxScore}
            </Col>
          ) : (
            <Col className="custom-table-tooltip-value">
              {standardToRender?.[analyseByToKeyToRender[_analyseBy]]}
              {_analyseBy === 'score(%)' ? '%' : ''}
            </Col>
          )}
        </Row>
      </div>
    )

    const obj = {
      termId: filters.termId,
      studentId: record.studentId,
      standardId,
      profileId: filters.profileId,
      assessmentTypes:
        filters.assessmentTypes !== 'All' ? filters.assessmentTypes : '',
    }
    const getCellContents = (props) => {
      const { printData } = props
      const bgColor =
        (_analyseBy === 'masteryLevel' || _analyseBy === 'masteryScore') &&
        standardToRender?.color
      return _compareBy === 'studentId' && printData !== 'N/A' ? (
        <ColoredCell
          bgColor={bgColor}
          onClick={() =>
            handleOnClickStandard(obj, standardName, record.compareByLabel)
          }
        >
          {printData}
        </ColoredCell>
      ) : (
        <ColoredCell bgColor={bgColor}>{printData}</ColoredCell>
      )
    }

    const printData = getDisplayValue(
      standardToRender,
      _analyseBy,
      data,
      record
    )

    return (
      <CustomTableTooltip
        printData={printData}
        placement="top"
        title={tooltipText}
        getCellContents={getCellContents}
      />
    )
  }

  const getColumnsData = () => {
    const extraColsNeeded =
      filteredTableData.length && filteredTableData[0].standardsInfo.length
    let result = [
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
        title: 'Overall',
        dataIndex: analyseByToKeyToRender[tableDdFilters.analyseBy],
        key: analyseByToKeyToRender[tableDdFilters.analyseBy],
        width: 150,
        sorter: (a, b) => {
          const key = analyseByToKeyToRender[tableDdFilters.analyseBy]
          return a[key] - b[key]
        },
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
      },
    ]

    if (tableDdFilters.compareBy === 'studentId') {
      let index = 1
      for (const column of compareByStudentsColumns) {
        result.splice(index++, 0, column)
      }
    }

    if (extraColsNeeded) {
      result = [
        ...result,
        ...Object.values(
          keyBy(
            flatMap(filteredTableData, ({ standardsInfo }) => standardsInfo),
            'standardId'
          )
        ).map((item, index) => {
          const standardProgressNav = getStandardProgressNav(
            navigationItems,
            item.standardId,
            tableDdFilters.compareBy
          )
          const titleComponent = (
            <>
              <span>{item.standardName}</span>
              <br />
              <span>
                {getCurrentStandard(item.standardId, tableDdFilters.analyseBy)}
              </span>
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
            render: renderStandardIdColumns(
              index,
              tableDdFilters.compareBy,
              tableDdFilters.analyseBy,
              item.standardName,
              item.standardId
            ),
          }
        }),
      ]
    }

    return result
  }

  const columnsData = getColumnsData()

  const scrollX = useMemo(() => {
    const visibleColumns = columnsData.filter((column) => !column.visibleOn)
    return visibleColumns.length * 180 || '100%'
  }, [columnsData])

  const compareByDropDownData = next(
    dropDownFormat.compareByDropDownData,
    (arr) => {
      if (role === 'teacher') {
        arr.splice(0, 2)
      }
    }
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
            columns={columnsData}
            dataSource={filteredTableData}
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
