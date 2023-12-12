import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { round, intersection, filter, map } from 'lodash'
import { Row, Col } from 'antd'
import { greyThemeDark1 } from '@edulastic/colors'
import { StyledTable, StyledSpan } from '../../styled'
import { TooltipTag, TooltipTagContainer } from './TooltipTag'
import { StyledTag } from '../../../../../../common/styled'
import StudentMasteryTable from './StudentMasteryTable'

const columns = [
  {
    title: 'Domain',
    key: 'name',
    dataIndex: 'name',
    render: (name) => (
      <StyledTag padding="0px 20px" fontWeight="Bold">
        {name}
      </StyledTag>
    ),
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Standards',
    key: 'standards',
    align: 'center',
    dataIndex: 'standards',
    render: (standards) => {
      const displayCount = 3
      return (
        <Row type="flex" justify="center">
          {[
            ...standards
              .slice(0, displayCount)
              .map((standard) => <TooltipTag standard={standard} />),
            <TooltipTagContainer standards={standards.slice(displayCount)} />,
          ]}
        </Row>
      )
    },
    sorter: (a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true }),
  },
  {
    title: 'Standard Set',
    key: 'curriculumName',
    dataIndex: 'curriculumName',
  },
  {
    title: 'Domain Description',
    key: 'description',
    align: 'center',
    dataIndex: 'description',
    render: (description) => (
      <StyledSpan alignment="center">{description}</StyledSpan>
    ),
    sorter: (a, b) => a.description.localeCompare(b.description),
  },
  {
    title: 'Domain Mastery',
    key: 'masteryScore',
    align: 'center',
    dataIndex: 'masteryScore',
    render: (value) => (
      <StyledSpan>{`${round(value)}% Standards Mastered`}</StyledSpan>
    ),
    sorter: (a, b) => {
      if (a.masteryScore !== b.masteryScore) {
        return a.masteryScore - b.masteryScore
      }
      return a.name.localeCompare(b.name)
    },
  },
  {
    title: 'Domain Mastery Summary',
    key: 'masterySummary',
    align: 'center',
    dataIndex: 'masterySummary',
    render: ({ masteryName, color }) => (
      <Row type="flex" justify="center">
        <StyledTag
          width="200px"
          height="34px"
          bgColor={color}
          textColor={greyThemeDark1}
          fontStyle="11px/15px Open Sans"
          fontWeight="Bold"
        >
          {masteryName}
        </StyledTag>
      </Row>
    ),
    sorter: (a, b) => {
      if (a.masterySummary.masteryName !== b.masterySummary.masteryName) {
        return a.masterySummary.masteryName.localeCompare(
          b.masterySummary.masteryName
        )
      }
      if (a.masteryScore !== b.masteryScore) {
        return a.masteryScore - b.masteryScore
      }
      return a.name.localeCompare(b.name)
    },
  },
]

const standardsTableColumns = [
  'DOMAIN',
  'STANDARD',
  'DESCRIPTION ',
  'MASTERY ',
  'ASSESSMENT ',
  'TOTAL QUESTIONS ',
  'SCORE ',
  'MAX POSSIBLE SCORE ',
  'AVG. SCORE(%) ',
]

const standardsTableKeys = [
  'standard',
  'standardName',
  'masteryName',
  'testCount',
  'questionCount',
  'totalScore',
  'maxScore',
  'scoreFormatted',
]

const StudentPerformanceSummary = ({
  data,
  selectedMastery,
  expandedRowProps,
  expandAllRows,
  setExpandAllRows,
  domainKeyToExpand,
  setDomainKeyToExpand,
  rowSelection = null,
}) => {
  const [expandedRows, setExpandedRows] = useState([])

  const handleExpandedRowsChange = (rowIndex, totalCount) => {
    let expandedCount = 0
    setExpandedRows((state) => {
      if (state.includes(rowIndex)) {
        expandedCount = state.length - 1
        return state.filter((item) => item !== rowIndex)
      }
      expandedCount = state.length + 1
      return [...state, rowIndex]
    })
    if (expandedCount === 0) {
      setExpandAllRows(false)
    } else if (expandedCount === totalCount) {
      setExpandAllRows(true)
    }
  }

  const filteredDomains = map(
    filter(data, (domain) => {
      if (!selectedMastery.length) {
        return data
      }
      const domainStandardsMastery = map(
        domain.standards,
        (standard) => standard.scale.masteryLabel
      )
      return intersection(domainStandardsMastery, selectedMastery).length
    }),
    (item, index) => {
      item.rowIndex = index
      return item
    }
  )

  useEffect(() => {
    expandAllRows
      ? setExpandedRows(filteredDomains.map((d) => d.key))
      : setExpandedRows([])
  }, [expandAllRows])

  useEffect(() => {
    if (domainKeyToExpand) {
      const domainKey = filteredDomains.find((d) => d.key === domainKeyToExpand)
        ?.key
      if (domainKey && !expandedRows.includes(domainKey)) {
        setExpandedRows([...expandedRows, domainKey])
        setExpandAllRows(expandedRows.length + 1 === filteredDomains.length)
        setDomainKeyToExpand(null)
      }
    }
  }, [domainKeyToExpand, expandedRows, filteredDomains])

  useEffect(() => {
    if (expandedRowProps.isCsvDownloading) {
      const csv = [standardsTableColumns.join(',')]
      const csvRawData = [[...standardsTableColumns]]
      for (const domain of filteredDomains) {
        for (const standardInfo of domain.standards) {
          const row = []
          row.push(domain.name)
          for (const key of standardsTableKeys) {
            const rowData = String(standardInfo[key])
              .replace(/(\r\n|\n|\r)/gm, ' ')
              .replace(/(\s+)/gm, ' ')
              .replace(/"/g, '""')
            row.push(`"${rowData}"`)
          }
          csvRawData.push(row)
          csv.push(row.join(','))
        }
      }
      const csvText = csv.join('\n')
      expandedRowProps.onCsvConvert(csvText, csvRawData)
    }
  }, [expandedRowProps.isCsvDownloading])

  return (
    <Row>
      <Col>
        <StyledTable
          id="student_reports_table"
          dataSource={filteredDomains}
          rowKey={(record) => record.key}
          columns={columns}
          pagination={false}
          expandIconAsCell={false}
          expandIconColumnIndex={-1}
          expandedRowRender={(record) => (
            <StudentMasteryTable parentRow={record} {...expandedRowProps} />
          )}
          expandRowByClick
          onRow={(record) => ({
            onClick: () =>
              handleExpandedRowsChange(record.key, filteredDomains.length),
          })}
          expandedRowKeys={expandedRows}
          rowSelection={rowSelection}
        />
      </Col>
    </Row>
  )
}

StudentPerformanceSummary.propTypes = {
  data: PropTypes.array,
  selectedMastery: PropTypes.array,
}

StudentPerformanceSummary.defaultProps = {
  data: [],
  selectedMastery: [],
}

export default StudentPerformanceSummary
