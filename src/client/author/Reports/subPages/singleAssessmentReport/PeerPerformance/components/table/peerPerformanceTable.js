import { Col, Row } from 'antd'
import next from 'immer'
import { sumBy } from 'lodash'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { StyledH3, ColoredCell } from '../../../../../common/styled'
import { downloadCSV, getHSLFromRange1 } from '../../../../../common/util'
import { idToName } from '../../util/transformers'
import { StyledTable } from '../styled'

const getDisplayValue = (data, record, analyseBy, columnKey) => {
  let printData = data
  const NA = 'N/A'
  if (
    printData === 0 &&
    (analyseBy === 'aboveBelowStandard' || analyseBy === 'proficiencyBand')
  ) {
    return NA
  }
  if (analyseBy === 'score(%)') {
    printData = `${record[columnKey]}%`
  } else if (analyseBy === 'rawScore') {
    printData = record[columnKey].toFixed(2)
  } else if (
    analyseBy === 'proficiencyBand' ||
    analyseBy === 'aboveBelowStandard'
  ) {
    printData = `${data} (${Math.abs(record[`${columnKey}Percentage`])}%)`
  }
  return printData
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
}) => {
  const sortNumbers = (key) => (a, b) => {
    const _a = a[key] || 0
    const _b = b[key] || 0

    return _a - _b
  }

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
          <Col className="custom-table-tooltip-value">{rec.compareBylabel}</Col>
        </Row>
        {analyseBy === 'score(%)' || analyseBy === 'rawScore' ? (
          <>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Assigned: </Col>
              <Col className="custom-table-tooltip-value">
                {rec.graded + rec.absent}
              </Col>
            </Row>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Submitted: </Col>
              <Col className="custom-table-tooltip-value">{rec.graded}</Col>
            </Row>
            <Row className="tooltip-row" type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Absent: </Col>
              <Col className="custom-table-tooltip-value">{rec.absent}</Col>
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
                {analyseBy === 'score(%)'
                  ? getDisplayValue(
                      rec.avgStudentScorePercentUnrounded,
                      rec,
                      analyseBy,
                      'avgStudentScorePercent'
                    )
                  : getDisplayValue(
                      rec.avgStudentScoreUnrounded,
                      rec,
                      analyseBy,
                      'avgStudentScore'
                    )}
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
                  : `${Math.abs(rec[`${columnKey}Percentage`])}%`}
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

  const tableData = useMemo(() => {
    const arr = dataSource.filter(
      (item) => filter[item[compareBy]] || Object.keys(filter).length === 0
    )
    return arr
  }, [dataSource, filter])

  let colouredCellsNo = 0

  _columns = next(columns, (arr) => {
    if (analyseBy === 'score(%)') {
      arr[arr.length - 1].render = colorCell('fill', 'avgStudentScorePercent')
      arr[arr.length - 2].render = colorCell('dFill', 'districtAvg')
      colouredCellsNo = 2
    } else if (analyseBy === 'rawScore') {
      arr[arr.length - 1].render = colorCell('fill', 'avgStudentScore')
      arr[arr.length - 2].render = colorCell('dFill', 'districtAvg')
      colouredCellsNo = 2
    } else if (analyseBy === 'aboveBelowStandard') {
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
      arr[arr.length - 2].sorter = sortNumbers(arr[arr.length - 2].key)
      colouredCellsNo = 2
    } else {
      bandInfo.sort((a, b) => a.threshold - b.threshold)
      for (let i = 0; i < bandInfo.length; i++) {
        dataSource.forEach((d) => {
          d[`fill_${i}`] = bandInfo[i].color
        })
      }

      const allBandCols = {}
      for (const band of bandInfo) {
        const name = band.name
        const sum = sumBy(tableData, (o) => o[`${name}Percentage`])
        allBandCols[`${name}Percentage`] = sum !== 0
      }

      let validBandCols = 0
      for (const [index, value] of bandInfo.entries()) {
        if (!allBandCols[`${value.name}Percentage`]) {
          continue
        }
        arr.push({
          title: value.name,
          dataIndex: value.name,
          key: value.name,
          width: 250,
          render: colorCell(`fill_${index}`, value.name, value.name),
        })
        validBandCols++
      }
      colouredCellsNo = validBandCols
    }
    arr[arr.length - 1].sorter = sortNumbers(arr[arr.length - 1].key)
    if (
      role === 'teacher' &&
      (compareBy === 'groupId' || compareBy === 'group')
    ) {
      arr.splice(1, 2)
    }
  })

  const onCsvConvert = (data) =>
    downloadCSV(`Sub-group Performance School Report.csv`, data)

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
        tableToRender={StyledTable}
        scroll={{ x: '100%' }}
      />
    </div>
  )
}

const StyledDiv = styled.div`
  padding: 10px;
`
