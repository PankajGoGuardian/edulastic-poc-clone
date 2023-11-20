import React from 'react'
import { filter, intersection } from 'lodash'
import PropTypes from 'prop-types'
import { Col, Row } from 'antd'
import { greyThemeDark1, themeColorLight } from '@edulastic/colors'
import TableTooltipRow from '../../../../../../common/components/tooltip/TableTooltipRow'
import {
  CustomTableTooltip,
  CustomWhiteBackgroundTooltip,
} from '../../../../../../common/components/customTableTooltip'
import { StyledCell } from '../../../../../../common/styled'
import CsvTable from '../../../../../../common/components/tables/CsvTable'
import { ReStyledTag, StyledSpan, StyledTable } from '../../styled'

const getCol = (text, backgroundColor) => (
  <StyledCell justify="center" $bgColor={backgroundColor}>
    {text}
  </StyledCell>
)

const renderToolTipColumn = (columnName) => (value, record) => {
  const toolTipText = () => (
    <div>
      <TableTooltipRow title="Mastery : " value={record.masteryName} />
      <TableTooltipRow title="Domain : " value={record.domain} />
      <TableTooltipRow title="Standard : " value={record.standard} />
      <TableTooltipRow title="Description : " value={record.standardName} />
      <TableTooltipRow title={`${columnName} : `} value={value} />
    </div>
  )

  const { color = '#cccccc' } = record.scale

  return (
    <CustomTableTooltip
      placement="top"
      title={toolTipText()}
      getCellContents={() => getCol(value, color)}
    />
  )
}

const getColumns = (handleOnClickStandard, filters) => {
  const columns = [
    {
      title: 'Standard',
      key: 'standard',
      dataIndex: 'standard',
      fixed: 'left',
      width: 150,
      render: (data, record) => {
        const obj = {
          termId: filters.termId,
          studentId: record.studentId,
          standardId: record.standardId,
          profileId: filters.profileId,
          // for student only one group will be available
          groupId: filters.groupIds,
          finalMastery: record.fm,
        }
        return (
          <ReStyledTag
            onClick={() => handleOnClickStandard(obj, data)}
            bgColor={record.scale.color}
            textColor={greyThemeDark1}
            padding="0px 10px"
            fontWeight="Bold"
            cursor="pointer"
          >
            {data}
          </ReStyledTag>
        )
      },
      sorter: (a, b) =>
        a.standard.localeCompare(b.standard, undefined, { numeric: true }),
    },
    {
      title: 'Description',
      key: 'standardName',
      dataIndex: 'standardName',
      width: 250,
      render: (data) => {
        let str = data || ''
        if (str.length > 60) {
          str = `${str.substring(0, 60)}...`
        }
        return <CustomWhiteBackgroundTooltip data={data} str={str} />
      },
      sorter: (a, b) => a.standardName.localeCompare(b.standardName),
    },
    {
      title: 'Mastery',
      key: 'masteryName',
      align: 'center',
      dataIndex: 'masteryName',
      render: (data, record) => {
        const obj = {
          termId: filters.termId,
          studentId: record.studentId,
          standardId: record.standardId,
          profileId: filters.profileId,
        }
        return (
          <StyledSpan
            onClick={() => handleOnClickStandard(obj, record.standard)}
            cursor="pointer"
            alignment="center"
            hoverColor={themeColorLight}
          >
            {data}
          </StyledSpan>
        )
      },
      sorter: (a, b) => {
        if (a.masteryName !== b.masteryName) {
          return a.masteryName.localeCompare(b.masteryName)
        }
        return a.score - b.score
      },
    },
    {
      title: 'Assessment',
      key: 'testCount',
      dataIndex: 'testCount',
      align: 'center',
      render: renderToolTipColumn('Assessments'),
      sorter: (a, b) => a.testCount - b.testCount,
    },
    {
      title: 'Total Questions',
      key: 'questionCount',
      dataIndex: 'questionCount',
      align: 'center',
      render: renderToolTipColumn('Total Questions'),
      sorter: (a, b) => a.questionCount - b.questionCount,
    },
    {
      title: 'Score',
      key: 'totalScore',
      dataIndex: 'totalScore',
      align: 'center',
      render: renderToolTipColumn('Score'),
      sorter: (a, b) => a.totalScore - b.totalScore,
    },
    {
      title: 'Max Possible Score',
      key: 'maxScore',
      dataIndex: 'maxScore',
      align: 'center',
      render: renderToolTipColumn('Max Possible Score'),
      sorter: (a, b) => a.maxScore - b.maxScore,
    },
    {
      title: 'Avg. Score(%)',
      key: 'scoreFormatted',
      dataIndex: 'scoreFormatted',
      align: 'center',
      render: renderToolTipColumn('Avg. Score'),
      sorter: (a, b) => a.score - b.score,
    },
  ]
  return columns
}

const StudentMasteryTable = ({
  parentRow,
  data,
  selectedMastery,
  onCsvConvert,
  handleOnClickStandard,
  filters,
  rowSelection = null,
}) => {
  const filteredStandards = filter(
    data,
    (standard) =>
      (!selectedMastery.length ||
        intersection([standard.scale.masteryLabel], selectedMastery).length) &&
      (!parentRow || String(parentRow.domainId) === String(standard.domainId))
  )

  const _columns = getColumns(handleOnClickStandard, filters)

  return (
    <Row>
      <Col>
        <CsvTable
          dataSource={filteredStandards}
          columns={_columns}
          colouredCellsNo={5}
          tableToRender={StyledTable}
          onCsvConvert={onCsvConvert}
          scroll={{ x: '100%' }}
          rowKey={(record) => record.standardId}
          rowSelection={rowSelection}
        />
      </Col>
    </Row>
  )
}

StudentMasteryTable.propTypes = {
  data: PropTypes.array,
  selectedMastery: PropTypes.array,
  onCsvConvert: PropTypes.func,
}

StudentMasteryTable.defaultProps = {
  data: [],
  selectedMastery: [],
  onCsvConvert: () => {},
}

export default StudentMasteryTable
