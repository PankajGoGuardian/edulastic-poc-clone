import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Row } from 'antd'
import { find, groupBy, keyBy, isEmpty, isNaN, omit } from 'lodash'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'
import { StyledCard, StyledTable, StyledSpan } from '../styled'

import { ResponseTag } from './responseTag'
import PrintableTable from '../../../../../common/components/tables/PrintableTable'
import CsvTable from '../../../../../common/components/tables/CsvTable'

export const SELAssessmentTable = ({
  columns: _columns,
  isCsvDownloading,
  isPrinting,
  data: dataSource,
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
  const col3_render = useCallback(
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
      data = omit(data, ['[]'])
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
      arr.sort((a, b) => b.value - a.value)
      return (
        <Row type="flex" justify="start" className="table-tag-container">
          {arr[0].record.options.map((_data, i) =>
            _data.value ||
            (checkForQtypes.includes(_data.record.qType.toLocaleLowerCase()) &&
              hasChoiceData) ? (
              <ResponseTag
                isPrinting={isPrinting}
                idx={i}
                data={_data}
                arr={arr}
                incorrectFrequencyThreshold={incorrectFrequencyThreshold}
              />
            ) : null
          )}
        </Row>
      )
    },
    [incorrectFrequencyThreshold, isPrinting]
  )
  const col1_render = useCallback(
    (text) => {
      return (
        <StyledSpan font="12px" dangerouslySetInnerHTML={{ __html: text }} />
      )
    },
    [isSharedReport]
  )

  const columns = useMemo(() => {
    const cols = [..._columns]
    cols[0] = {
      ...cols[0],
      sorter: col0_sorter,
      render: col0_render,
    }

    cols[1] = { ...cols[1], render: col1_render }
    cols[2] = { ...cols[2], render: col2_render }
    cols[3] = { ...cols[3], render: col3_render }
    return cols
  }, [_columns, col0_sorter, col0_render, col2_render, col3_render])

  const onCsvConvert = (data, rawData) => {
    // extract all rows except the columns name
    const csvRows = rawData.splice(1, rawData.length)
    const modifiedCsvRows = csvRows.map((csvRow) => {
      const item = csvRow[3]
      csvRow[3] = `"${item
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
    downloadCSV(`SEL Assessment Responses.csv`, csvData)
  }

  return (
    <StyledCard className="response-frequency-table">
      <CsvTable
        data-testid="response-frequency-table"
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
