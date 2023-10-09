import { Col, Row, Tooltip } from 'antd'
import next from 'immer'
import { sumBy } from 'lodash'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { reportUtils } from '@edulastic/constants'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { StyledH3, ColoredCell } from '../../../../../common/styled'
import { downloadCSV } from '../../../../../common/util'
import { idToName } from '../../util/transformers'
import { StyledTable } from '../styled'
import { CompareByContainer } from '../../../../dataWarehouseReports/common/components/styledComponents'

const { analyseByOptions, getDisplayValue } = reportUtils.peerPerformance

const enableSorts = {
  'dimension.name': 'dimension',
  aboveStandard: 'aboveStandard',
  avgSore: 'scorePerc',
}

export const PeerPerformanceTable = ({
  columns,
  dataSource,
  rowKey,
  analyseBy,
  compareBy,
  assessmentName,
  filter,
  bandInfo,
  role,
  isCsvDownloading = false,
  setSortKey,
  setSortOrder,
  sortOrder,
  sortKey,
  setPageNo,
}) => {
  let _columns = []

  const colorCell = (colorkey, columnKey, columnTitle) => (data, record) => {
    const tooltipText = (rec) => () => (
      <div>
        <Row className="tooltip-row" type="flex" justify="start">
          <Col className="custom-table-tooltip-key">Assessment Name: </Col>
          <Col className="custom-table-tooltip-value">{assessmentName}</Col>
        </Row>
        <Row className="tooltip-row" type="flex" justify="start">
          <Col className="custom-table-tooltip-key">{`${idToName(
            compareBy
          )}: `}</Col>
          <Col className="custom-table-tooltip-value">{rec.dimension.name}</Col>
        </Row>
        {analyseBy === analyseByOptions.scorePerc ||
        analyseBy === analyseByOptions.rawScore ? (
          <>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Assigned: </Col>
              <Col className="custom-table-tooltip-value">
                {rec.absentStudents + rec.submittedStudents}
              </Col>
            </Row>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Submitted: </Col>
              <Col className="custom-table-tooltip-value">
                {rec.submittedStudents}
              </Col>
            </Row>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Absent: </Col>
              <Col className="custom-table-tooltip-value">
                {rec.absentStudents}
              </Col>
            </Row>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">District Avg: </Col>
              <Col className="custom-table-tooltip-value">
                {getDisplayValue(
                  rec.districtAvg,
                  rec,
                  analyseBy,
                  'districtAvg'
                )}
              </Col>
            </Row>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">
                Student Avg Score:{' '}
              </Col>
              <Col className="custom-table-tooltip-value">
                {getDisplayValue(rec.avgSore, rec, analyseBy, 'dimensionAvg')}
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Performance Band: </Col>
              <Col className="custom-table-tooltip-value">{columnTitle}</Col>
            </Row>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Student#: </Col>
              <Col className="custom-table-tooltip-value">
                {rec[columnKey] === 0 ? 'N/A' : rec[columnKey]}
              </Col>
            </Row>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Student(%): </Col>
              <Col className="custom-table-tooltip-value">
                {rec[columnKey] === 0
                  ? 'N/A'
                  : `${Math.abs(
                      (rec[columnKey] * 100) / rec.totalStudents
                    ).toFixed(0)}%`}
              </Col>
            </Row>
          </>
        )}
      </div>
    )

    const getCellContents = (props) => {
      const { printData, colorKey } = props
      return <ColoredCell bgColor={record[colorKey]}>{printData}</ColoredCell>
    }

    const printData = getDisplayValue(data, record, analyseBy, columnKey)

    return (
      <CustomTableTooltip
        printData={printData}
        colorKey={colorkey}
        placement="top"
        title={tooltipText(record)}
        getCellContents={getCellContents}
      />
    )
  }

  const tableData = useMemo(
    () =>
      dataSource.filter((item) => {
        return filter[item.dimension._id] || Object.keys(filter).length === 0
      }),
    [dataSource, filter]
  )

  let colouredCellsNo = 0

  _columns = next(columns, (arr) => {
    arr.forEach((item) => {
      if (enableSorts[item.dataIndex]) {
        item.sorter = true
        item.key = enableSorts[item.dataIndex]
      }
      if (item.key === sortKey) {
        item.sortOrder = sortOrder
      }
    })

    const dimensionCol = arr.find(({ key }) => key === 'dimension')
    dimensionCol.render = (data) => (
      <Tooltip title={data}>
        <CompareByContainer className="dimension-name">
          {data}
        </CompareByContainer>
      </Tooltip>
    )

    if (analyseBy === analyseByOptions.scorePerc) {
      arr[arr.length - 1].render = colorCell('fill', 'dimensionAvg')
      arr[arr.length - 2].render = colorCell('dFill', 'districtAvg')
      colouredCellsNo = 2
    } else if (analyseBy === analyseByOptions.rawScore) {
      arr[arr.length - 1].render = colorCell('fill', 'dimensionAvg')
      arr[arr.length - 2].render = colorCell('dFill', 'districtAvg')
      colouredCellsNo = 2
    } else if (analyseBy === analyseByOptions.aboveBelowStandard) {
      arr[arr.length - 1].render = colorCell(
        'fill_0',
        'aboveStandard',
        'Above Standard'
      )
      arr[arr.length - 2].render = colorCell(
        'fill_1',
        'belowStandard',
        'Below Standard'
      )
      colouredCellsNo = 2
    } else {
      for (let i = 0; i < bandInfo.length; i++) {
        dataSource.forEach((d) => {
          d[`fill_${i}`] = bandInfo[i].color
        })
      }

      const allBandCols = {}
      for (const { name } of bandInfo) {
        const sum = sumBy(tableData, (o) => o[name])
        allBandCols[name] = sum !== 0
      }

      let validBandCols = 0
      const performanceBandColumns = arr.filter(
        (item) => item[analyseByOptions.proficiencyBand]
      )
      const removeIndex = []
      for (const [index, value] of bandInfo.entries()) {
        if (!allBandCols[value.name]) {
          const startIndex = arr.length - bandInfo.length
          removeIndex.push(startIndex + index)
          continue
        }
        performanceBandColumns[index].width = 250
        performanceBandColumns[index].render = colorCell(
          `fill_${index}`,
          value.name,
          value.name
        )
        validBandCols++
      }
      for (let i = removeIndex.length - 1; i >= 0; i--) {
        arr.splice(removeIndex[i], 1)
      }
      colouredCellsNo = validBandCols
    }

    if (
      role === 'teacher' &&
      (compareBy === 'class' || compareBy === 'group')
    ) {
      arr.splice(1, 2)
    }
  })

  const onCsvConvert = (data) =>
    downloadCSV(`Sub-group Performance School Report.csv`, data)

  const onChange = (_, __, column) => {
    setSortKey(column.columnKey)
    setSortOrder(column.order)
    setPageNo(1)
  }

  return (
    <div>
      <StyledDiv>
        <StyledH3 data-testid="peerPerformanceTable">
          Assessment Statistics By {idToName(compareBy)} | {assessmentName}
        </StyledH3>
      </StyledDiv>
      <CsvTable
        isCsvDownloading={isCsvDownloading}
        onCsvConvert={onCsvConvert}
        colouredCellsNo={colouredCellsNo}
        columns={_columns}
        dataSource={tableData}
        rowKey={rowKey}
        pagination={false}
        tableToRender={StyledTable}
        scroll={{ x: '100%' }}
        onChange={onChange}
      />
    </div>
  )
}

const StyledDiv = styled.div`
  padding: 10px;
`
