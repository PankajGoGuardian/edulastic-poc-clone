import React from 'react'
import { Link } from 'react-router-dom'
import { includes, filter, isEmpty } from 'lodash'
import next from 'immer'
import { Row, Col, Tooltip } from 'antd'
import styled from 'styled-components'

import { withNamespaces } from '@edulastic/localization'
import { reportUtils } from '@edulastic/constants'
import { IconInfo } from '@edulastic/icons'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import {
  StyledH3,
  StyledTable,
  ColoredCell,
  StyledDropDownContainer,
} from '../../../../../common/styled'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import TableTooltipRow from '../../../../../common/components/tooltip/TableTooltipRow'
import CsvTable from '../../../../../common/components/tables/CsvTable'

const { downloadCSV } = reportUtils.common
const {
  getOptionFromKey,
  getMasteryScoreColor,
  getAnalyseByTitle,
  getOverallValue,
  getColValue,
} = reportUtils.standardsPerformanceSummary

const getDomainColumnRender = (
  t,
  domainId,
  domainName,
  compareBy,
  analyseByKey,
  scaleInfo
) => (_, record) => {
  const domain = record.domainData[domainId] || {}
  const colValue = getColValue(record, domainId, analyseByKey, scaleInfo)
  const bgColor =
    (analyseByKey === 'masteryLevel' || analyseByKey === 'masteryScore') &&
    getMasteryScoreColor(domain, scaleInfo)

  const tooltipTitle = (
    <div>
      <TableTooltipRow
        title={`${compareBy.title}: `}
        value={
          record.name && record.name !== 'undefined'
            ? record.name
            : t('common.anonymous')
        }
      />
      <TableTooltipRow title="Domain: " value={domainName} />
      <TableTooltipRow
        title={`${getAnalyseByTitle(analyseByKey)}: `}
        value={colValue}
      />
    </div>
  )

  return (
    <CustomTableTooltip
      placement="top"
      title={tooltipTitle}
      getCellContents={() =>
        colValue === 'N/A' ? (
          colValue
        ) : (
          <ColoredCell bgColor={bgColor}>{colValue}</ColoredCell>
        )
      }
    />
  )
}

const getColumnSorter = (analyseByKey, scaleInfo, domainId) => (a, b) => {
  // sort by score(%), if analyseBy rawScore / score(%)
  // sort by masteryScore, if analyseBy masteryScore / masteryLevel
  const _analyseByKey =
    analyseByKey === 'rawScore'
      ? 'score'
      : analyseByKey === 'masteryLevel'
      ? 'masteryScore'
      : analyseByKey

  // result for avg. domain performance
  const colAvgA = getOverallValue(a, _analyseByKey, scaleInfo)
  const colAvgB = getOverallValue(b, _analyseByKey, scaleInfo)
  let result = (parseFloat(colAvgA) || 0) - (parseFloat(colAvgB) || 0)

  // for avg. performance column, domainId is undefined
  if (domainId) {
    const colValueA = getColValue(a, domainId, _analyseByKey, scaleInfo)
    const colValueB = getColValue(b, domainId, _analyseByKey, scaleInfo)
    // for result, consider 'N/A' as -1 (lower precedence than 0)
    const _result =
      (colValueA === 'N/A' ? -1 : parseFloat(colValueA) || 0) -
      (colValueB === 'N/A' ? -1 : parseFloat(colValueB) || 0)
    // for domain column, if values are equal, sort by avg. performance column
    result = _result || result
  }

  return result
}

export const getColumns = (
  compareBy,
  analyseByKey,
  domains,
  scaleInfo,
  selectedDomains,
  selectedTermId,
  t,
  isSharedReport
) => {
  const filteredDomains = filter(
    domains,
    (domain) =>
      includes(selectedDomains, domain.domainId) || !selectedDomains.length
  )
  const domainCols = filteredDomains.map((domain) => ({
    title: (
      <>
        <span>{domain.domainName}</span>
        <br />
        <span>
          {domain[analyseByKey]} {analyseByKey == 'score' ? '%' : ''}
        </span>
      </>
    ),
    dataIndex: domain.domainName,
    key: domain.domainName,
    render: getDomainColumnRender(
      t,
      domain.domainId,
      domain.domainName,
      compareBy,
      analyseByKey,
      scaleInfo
    ),
    sorter: getColumnSorter(analyseByKey, scaleInfo, domain.domainId),
  }))

  const cols = [
    {
      title: compareBy.title,
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      render: (data, record) =>
        compareBy.title === 'Student' && !isSharedReport ? (
          <Link
            to={`/author/reports/student-profile-summary/student/${record.id}?termId=${selectedTermId}`}
          >
            {data || t('common.anonymous')}
          </Link>
        ) : compareBy.key === 'school' &&
          (isEmpty(data) || data === 'undefined') ? (
          '-'
        ) : (
          data
        ),
    },
    {
      title: (
        <div
          style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
        >
          <span>Avg. Domain Performance</span>
          <Tooltip title="This is the average performance across all the domains assessed">
            <IconInfo height={10} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'overall',
      key: 'overall',
      width: 140,
      render: (_, record) => getOverallValue(record, analyseByKey, scaleInfo),
      sorter: getColumnSorter(analyseByKey, scaleInfo),
    },
    ...domainCols,
    {
      title: 'SIS ID',
      dataIndex: 'sisId',
      key: 'sisId',
      visibleOn: ['csv'],
      render: (_, record) => record.rowInfo.sisId || '',
    },
  ]

  return cols
}

const onCsvConvert = (data) => downloadCSV(`Mastery By Domain.csv`, data)

const StandardsPerformanceTable = ({
  className,
  tableFilters,
  tableFiltersOptions,
  onFilterChange,
  domainsData,
  scaleInfo,
  selectedDomains,
  isCsvDownloading,
  selectedTermId,
  t,
  isSharedReport,
  ...tableProps
}) => {
  const columns = getColumns(
    tableFilters.compareBy,
    tableFilters.analyseBy.key,
    domainsData,
    scaleInfo,
    selectedDomains,
    selectedTermId,
    t,
    isSharedReport
  )

  const { analyseByData, compareByData } = tableFiltersOptions

  const onChangeTableFilters = (prefix, options, selectedPayload) => {
    const modifiedState = next(tableFilters, (draft) => {
      draft[prefix] = getOptionFromKey(options, selectedPayload.key)
    })
    onFilterChange(modifiedState)
  }

  const bindOnChange = (prefix, options) => (props) =>
    onChangeTableFilters(prefix, options, props)

  return (
    <>
      <Row type="flex" justify="start" className={className}>
        <Col xs={24} sm={24} md={11} lg={11} xl={12}>
          <StyledH3>
            Domain Mastery Details by {tableFilters.compareBy.title}
          </StyledH3>
        </Col>
        <Col xs={24} sm={24} md={13} lg={13} xl={12}>
          <Row className="control-dropdown-row">
            <StyledDropDownContainer
              data-cy="compareBy"
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={8}
              style={{ padding: '2.5px' }}
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
              md={13}
              lg={13}
              xl={8}
              style={{ padding: '2.5px' }}
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
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <CsvTable
            {...tableProps}
            colouredCellsNo={domainsData.length}
            centerAligned={domainsData.length}
            columns={columns}
            onCsvConvert={onCsvConvert}
            isCsvDownloading={isCsvDownloading}
            tableToRender={StyledTable}
            scroll={{ x: '100%' }}
          />
        </Col>
      </Row>
    </>
  )
}

const StyledStandardsPerformanceTable = styled(StandardsPerformanceTable)`
  .control-dropdown-row {
    display: flex;
    justify-content: flex-end;
  }
`

export default withNamespaces('student')(StyledStandardsPerformanceTable)
