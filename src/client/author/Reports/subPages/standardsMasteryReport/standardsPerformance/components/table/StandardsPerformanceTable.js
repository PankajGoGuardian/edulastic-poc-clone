import React from 'react'
import { Link } from 'react-router-dom'
import { sumBy, includes, filter, isEmpty } from 'lodash'
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
  getRecordMasteryLevel,
  getColValue,
} = reportUtils.standardsPerformanceSummary

const getCol = (record = {}, domainId, analyseByKey, scaleInfo) => {
  const domain = record.domainData[domainId] || {}
  const colValue = getColValue(record, domainId, analyseByKey, scaleInfo)
  if (colValue === 'N/A') {
    return colValue
  }
  const bgColor =
    (analyseByKey === 'masteryLevel' || analyseByKey === 'masteryScore') &&
    getMasteryScoreColor(domain, scaleInfo)
  return <ColoredCell bgColor={bgColor}>{colValue}</ColoredCell>
}

const getColorCell = (
  domainId,
  domainName,
  compareBy,
  analyseByKey,
  scaleInfo
) => (_, record) => {
  const toolTipText = (rec) => (
    <div>
      <TableTooltipRow
        title={`${compareBy.title}: `}
        value={rec.name === '' || rec.name === 'undefined' ? '-' : rec.name}
      />
      <TableTooltipRow title="Domain: " value={domainName} />
      <TableTooltipRow
        title={`${getAnalyseByTitle(analyseByKey)}: `}
        value={getColValue(rec, domainId, analyseByKey, scaleInfo)}
      />
    </div>
  )

  return (
    <CustomTableTooltip
      placement="top"
      title={toolTipText(record)}
      getCellContents={() => getCol(record, domainId, analyseByKey, scaleInfo)}
    />
  )
}

const getOverallColSorter = (_analyseByKey, _scaleInfo) => (a, b) => {
  const aRecords = Object.values(a.domainData || {})
  const bRecords = Object.values(b.domainData || {})
  switch (_analyseByKey) {
    case 'score':
    case 'masteryScore':
      return (
        parseFloat(getOverallValue(a, _analyseByKey, _scaleInfo)) -
        parseFloat(getOverallValue(b, _analyseByKey, _scaleInfo))
      )
    case 'rawScore':
      return sumBy(aRecords, 'totalScore') - sumBy(bRecords, 'totalScore')
    case 'masteryLevel':
      return (
        getRecordMasteryLevel(aRecords, _scaleInfo).score -
        getRecordMasteryLevel(bRecords, _scaleInfo).score
      )
    default:
      return 0
  }
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
    render: getColorCell(
      domain.domainId,
      domain.domainName,
      compareBy,
      analyseByKey,
      scaleInfo
    ),
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
      sorter: getOverallColSorter(analyseByKey, scaleInfo),
      render: (_, record) => getOverallValue(record, analyseByKey, scaleInfo),
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
