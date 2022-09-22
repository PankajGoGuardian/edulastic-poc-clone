import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'
import { find, groupBy, keyBy, omitBy, isEmpty, isNaN } from 'lodash'
import { StyledCard, StyledTable } from '../styled'
import { CustomTableTooltip } from '../../../../../common/components/customTableTooltip'
import { ResponseTag } from './responseTag'
import { getHSLFromRange1, downloadCSV } from '../../../../../common/util'
import PrintableTable from '../../../../../common/components/tables/PrintableTable'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { ColoredCell } from '../../../../../common/styled'

export const ResponseFrequencyTable = ({
  columns: _columns,
  assessment,
  isCsvDownloading,
  isPrinting,
  data: dataSource,
  correctThreshold,
  incorrectFrequencyThreshold,
  isSharedReport,
}) => {
  /**
   * set column details for frequency table
   */
  const [col0_sorter, col2_render, col4_sorter, col5_render] = useMemo(() => {
    const _col0_sorter = (a, b) =>
      Number(a.qLabel.substring(1)) - Number(b.qLabel.substring(1))

    const _col2_render = (data) => {
      if (data && Array.isArray(data)) {
        return data.join(', ')
      }
      if (typeof data == 'string') {
        return data
      }
      return ''
    }

    const _col4_sorter = (a, b) => {
      return (
        a.total_score / (a.total_max_score || 1) -
        b.total_score / (b.total_max_score || 1)
      )
    }

    const _col5_render = (data, record) => {
      const {
        corr_cnt = 0,
        incorr_cnt = 0,
        skip_cnt = 0,
        part_cnt = 0,
      } = record
      const sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt
      let skip = (skip_cnt / sum) * 100
      if (isNaN(skip)) skip = 0
      return `${Math.round(skip)}%`
    }

    return [_col0_sorter, _col2_render, _col4_sorter, _col5_render]
  }, [])
  const col0_render = useCallback(
    (text, record) => {
      const { pathname, search } = window.location
      return isSharedReport ? (
        text
      ) : (
        <Link
          to={{
            pathname: `/author/classboard/${record.assignmentId}/${record.groupId}/question-activity/${record.uid}`,
            state: {
              from: `${pathname}${search}`,
            },
          }}
        >
          {text}
        </Link>
      )
    },
    [isSharedReport, window.location.pathname, window.location.search]
  )
  const col4_render = useCallback(
    (data, record) => {
      const tooltipText = (rec) => () => {
        const {
          corr_cnt = 0,
          incorr_cnt = 0,
          skip_cnt = 0,
          part_cnt = 0,
          total_score = 0,
          total_max_score = 0,
        } = rec
        const sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt
        const averagePerformance = total_max_score
          ? Math.round((total_score / total_max_score) * 100)
          : 0
        return (
          <div>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Assessment Name: </Col>
              <Col className="custom-table-tooltip-value">
                {assessment.testName}
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Question: </Col>
              <Col className="custom-table-tooltip-value">{rec.qLabel}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Question Type: </Col>
              <Col className="custom-table-tooltip-value">{rec.qType}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Standards: </Col>
              <Col className="custom-table-tooltip-value">{rec.standards}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Max Score: </Col>
              <Col className="custom-table-tooltip-value">{rec.maxScore}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Performance: </Col>
              <Col className="custom-table-tooltip-value">
                {averagePerformance}%
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Students Skipped: </Col>
              <Col className="custom-table-tooltip-value">{skip_cnt}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Students Correct: </Col>
              <Col className="custom-table-tooltip-value">{corr_cnt}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className="custom-table-tooltip-key">Total Students: </Col>
              <Col className="custom-table-tooltip-value">{sum}</Col>
            </Row>
          </div>
        )
      }

      const getCellContents = (cellData) => {
        const { correct, correctThreshold: _correctThreshold } = cellData
        return (
          <div style={{ width: '100%', height: '100%' }}>
            {correct < _correctThreshold ? (
              <ColoredCell
                className="response-frequency-table-correct-td"
                bgColor={getHSLFromRange1(0)}
              >
                {correct}%
              </ColoredCell>
            ) : (
              <div className="response-frequency-table-correct-td">
                {correct}%
              </div>
            )}
          </div>
        )
      }

      const { total_score = 0, total_max_score = 0 } = record
      const averagePerformance = total_max_score
        ? Math.round((total_score / total_max_score) * 100)
        : 0
      return (
        <CustomTableTooltip
          correct={averagePerformance}
          correctThreshold={correctThreshold}
          placement="top"
          title={tooltipText(record)}
          getCellContents={getCellContents}
        />
      )
    },
    [correctThreshold, assessment]
  )
  const col6_render = useCallback(
    (data, record) => {
      const numToAlp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let arr = []
      const {
        corr_cnt = 0,
        incorr_cnt = 0,
        part_cnt = 0,
        skip_cnt = 0,
      } = record
      let sum = corr_cnt + incorr_cnt + part_cnt + skip_cnt
      if (sum == 0) sum = 1
      // V1 migrated UQA doesn't have user answer data
      let hasChoiceData = false
      // filter out empty keys from data
      const emptyKeyList = ['[]']
      data = omitBy(data || {}, (_, key) => emptyKeyList.includes(key))
      // show correct, incorrect & partial correct if data is empty
      if (isEmpty(data)) {
        arr.push({
          value: Number(((corr_cnt / sum) * 100).toFixed(0)),
          count: corr_cnt,
          name: 'Correct',
          key: 'corr_cnt',
          isCorrect: true,
          isUnselected: !corr_cnt,
          record,
        })
        arr.push({
          value: Number(((incorr_cnt / sum) * 100).toFixed(0)),
          count: incorr_cnt,
          name: 'Incorrect',
          key: 'incorr_cnt',
          isCorrect: false,
          isUnselected: !incorr_cnt,
          record,
        })
        arr.push({
          value: Number(((part_cnt / sum) * 100).toFixed(0)),
          count: part_cnt,
          name: 'Partially Correct',
          key: 'part_cnt',
          isCorrect: false,
          isUnselected: !part_cnt,
          record,
        })
      } else {
        hasChoiceData = true
        arr = Object.keys(data).map((comboKey) => {
          const slittedKeyArr = comboKey.split(',')
          let str = ''
          let isCorrect = true
          for (const key of slittedKeyArr) {
            for (let i = 0; i < record.options.length; i++) {
              // NOTE: comparison of number keys with string keys
              if (record.options[i].value == key) {
                str += numToAlp[i]
                const tmp = find(record.validation, (vstr) => key == vstr)
                isCorrect = !!(isCorrect && tmp)
              }
            }
          }
          if (
            record.qType.toLocaleLowerCase() === 'true or false' &&
            record.validation &&
            record.validation[0]
          ) {
            str = record.validation[0] === comboKey ? 'Correct' : 'Incorrect'
          }
          // sort characters in str
          if (str && !['Correct', 'Incorrect'].includes(str)) {
            str = str.split('').sort().join('')
          }
          return {
            value: (data[comboKey] / sum) * 100 || 0,
            count: data[comboKey] || 0,
            name: str,
            key: str,
            isCorrect,
            isUnselected: false,
            record,
          }
        })
      }

      const checkForQtypes = [
        'multiple choice - standard',
        'multiple choice - multiple response',
      ]

      const groupForQtypes = [
        ...checkForQtypes,
        'multiple choice - block layout',
        'multiple selection',
      ]

      // group arr data by key
      if (groupForQtypes.includes(record.qType.toLocaleLowerCase())) {
        const groupedArr = groupBy(arr, 'key')
        arr = Object.keys(groupedArr).map((k) => {
          const { value, count } = groupedArr[k].reduce(
            (res, ele) => ({
              value: res.value + ele.value,
              count: res.count + ele.count,
            }),
            {
              value: 0,
              count: 0,
            }
          )
          return { ...groupedArr[k][0], value, count }
        })
      }

      // augment arr data for missing choices (keys)
      if (
        checkForQtypes.includes(record.qType.toLocaleLowerCase()) &&
        hasChoiceData
      ) {
        const selectedMap = {}
        for (let i = 0; i < arr.length; i++) {
          selectedMap[arr[i].key] = true
        }

        const validation = keyBy(record.validation)
        for (let i = 0; i < record.options.length; i++) {
          if (!selectedMap[numToAlp[i]]) {
            arr.push({
              value: 0,
              count: 0,
              name: numToAlp[i],
              key: numToAlp[i],
              isCorrect: !!validation[record.options[i].value],
              isUnselected: true,
              record,
            })
          }
        }
      }

      // arr with rounded values & sorted by name
      arr = arr
        .map((_data) => ({ ..._data, value: Math.round(_data.value) }))
        .sort((a, b) =>
          (a.name || '')
            .toLowerCase()
            .localeCompare((b.name || '').toLowerCase())
        )

      return (
        <Row type="flex" justify="start" className="table-tag-container">
          {arr.map((_data, i) =>
            _data.value ||
            (checkForQtypes.includes(_data.record.qType.toLocaleLowerCase()) &&
              hasChoiceData) ? (
              <ResponseTag
                isPrinting={isPrinting}
                key={i}
                data={_data}
                incorrectFrequencyThreshold={incorrectFrequencyThreshold}
              />
            ) : null
          )}
        </Row>
      )
    },
    [incorrectFrequencyThreshold, isPrinting]
  )

  const columns = useMemo(() => {
    const cols = [..._columns]
    cols[0] = {
      ...cols[0],
      sorter: col0_sorter,
      render: col0_render,
    }

    cols[2] = { ...cols[2], render: col2_render }

    cols[4] = {
      ...cols[4],
      sorter: col4_sorter,
      render: col4_render,
    }

    cols[5] = { ...cols[5], render: col5_render }

    cols[6] = { ...cols[6], render: col6_render }
    return cols
  }, [
    _columns,
    col0_sorter,
    col0_render,
    col2_render,
    col4_sorter,
    col4_render,
    col5_render,
    col6_render,
  ])

  const onCsvConvert = (data, rawData) => {
    // extract all rows except the columns name
    const csvRows = rawData.splice(1, rawData.length)
    const modifiedCsvRows = csvRows.map((csvRow) => {
      const item = csvRow[6]
      csvRow[6] = `"${item
        .replace(/"/g, '')
        .replace(/%/g, '%,')
        .split(',')
        .filter((_item) => _item)
        .map((_item) => {
          const option = _item.replace(/\d+%/g, '')
          const number = _item.match(/\d+%/g)[0]
          return `${option ? `${option} :` : ''} ${number || 'N/A'}`
        })
        .join(', ')}"`

      return csvRow.join(',')
    })
    const csvData = [rawData[0].join(','), ...modifiedCsvRows].join('\n')
    downloadCSV(`Response Frequency.csv`, csvData)
  }

  return (
    <StyledCard className="response-frequency-table">
      <CsvTable
        isCsvDownloading={isCsvDownloading}
        onCsvConvert={onCsvConvert}
        tableToRender={PrintableTable}
        isPrinting={isPrinting}
        component={StyledTable}
        columns={columns}
        dataSource={dataSource}
        rowKey="uid"
        scroll={{ x: '100%' }}
      />
    </StyledCard>
  )
}
