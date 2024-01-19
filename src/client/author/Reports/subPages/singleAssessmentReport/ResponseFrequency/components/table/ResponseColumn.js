import React from 'react'
import { find, groupBy, keyBy, omitBy, isEmpty } from 'lodash'
import { Row } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { ResponseTag } from './responseTag'
import { CustomWhiteBackgroundTooltip } from '../../../../../common/components/customTableTooltip'
import { StyledIconInfo } from '../styled'
import { NOT_AVAILABLE_LABEL } from '../../utils'

export function ResponseColumn({
  t,
  data,
  record,
  incorrectFrequencyThreshold,
  isPrinting,
}) {
  const numToAlp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let arr = []
  const {
    corr_cnt = 0,
    incorr_cnt = 0,
    part_cnt = 0,
    skip_cnt = 0,
    children = null,
  } = record
  if (children) {
    return (
      <FlexContainer justifyContent="center">
        {NOT_AVAILABLE_LABEL}
        <CustomWhiteBackgroundTooltip
          data={t('responseFrequency.responsesColumnTooltip')}
          str={<StyledIconInfo />}
        />
      </FlexContainer>
    )
  }
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
      (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase())
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
}