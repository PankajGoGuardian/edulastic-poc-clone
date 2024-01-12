import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { isNaN } from 'lodash'
import { EduIf, FlexContainer } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'

import { StyledCard, StyledIconInfo, StyledTable } from '../styled'
import PrintableTable from '../../../../../common/components/tables/PrintableTable'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { ResponseColumn } from './ResponseColumn'
import { PerformanceColumn } from './PerformanceColumn'
import { NOT_AVAILABLE_LABEL, onCsvConvert } from '../../utils'
import { CustomWhiteBackgroundTooltip } from '../../../../../common/components/customTableTooltip'

const ResponseFrequencyTable = ({
  columns: _columns,
  assessment,
  isCsvDownloading,
  isPrinting,
  data: dataSource,
  correctThreshold,
  incorrectFrequencyThreshold,
  isSharedReport,
  t,
}) => {
  /**
   * set column details for frequency table
   */
  const [
    qLabelColumnSorter,
    standardsColumnRender,
    performanceColumnSorter,
    skipColumnRender,
  ] = useMemo(() => {
    const _qLabelColumnSorter = (a, b) =>
      Number(a.qLabel.substring(1)) - Number(b.qLabel.substring(1))

    const _standardsColumnRender = (data) => {
      if (data && Array.isArray(data)) {
        return data.join(', ')
      }
      if (typeof data == 'string') {
        return data
      }
      return ''
    }

    const _performanceColumnSorter = (a, b) => {
      return (
        a.total_score / (a.total_max_score || 1) -
        b.total_score / (b.total_max_score || 1)
      )
    }

    const _skipColumnRender = (data, record) => {
      const {
        corr_cnt = 0,
        incorr_cnt = 0,
        skip_cnt = 0,
        part_cnt = 0,
        children = null,
      } = record
      if (children) {
        return (
          <FlexContainer justifyContent="center">
            {NOT_AVAILABLE_LABEL}
            <CustomWhiteBackgroundTooltip
              data={t('responseFrequency.skipColumnTooltip')}
              str={<StyledIconInfo />}
            />
          </FlexContainer>
        )
      }
      const sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt
      let skip = (skip_cnt / sum) * 100
      if (isNaN(skip)) skip = 0
      return `${Math.round(skip)}%`
    }

    return [
      _qLabelColumnSorter,
      _standardsColumnRender,
      _performanceColumnSorter,
      _skipColumnRender,
    ]
  }, [])

  const qLabelColumnRender = useCallback(
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

  const maxScoreColumnRender = useCallback((value, record) => {
    const { multipartItem, itemLevelScoring, children = null } = record
    return (
      <FlexContainer justifyContent="center">
        {value}
        <EduIf condition={multipartItem && !children && itemLevelScoring}>
          <CustomWhiteBackgroundTooltip
            data={t('responseFrequency.maxScoreColumnTooltip')}
            str={<StyledIconInfo />}
          />
        </EduIf>
      </FlexContainer>
    )
  })

  const performanceColumnRender = useCallback(
    (data, record) => (
      <PerformanceColumn
        t={t}
        data={data}
        record={record}
        correctThreshold={correctThreshold}
        assessment={assessment}
      />
    ),
    [correctThreshold, assessment]
  )
  const responseColumnRender = useCallback(
    (data, record) => (
      <ResponseColumn
        t={t}
        data={data}
        record={record}
        incorrectFrequencyThreshold={incorrectFrequencyThreshold}
        isPrinting={isPrinting}
      />
    ),
    [incorrectFrequencyThreshold, isPrinting]
  )

  const columns = useMemo(() => {
    const cols = [..._columns]
    cols[0] = {
      ...cols[0],
      sorter: qLabelColumnSorter,
      render: qLabelColumnRender,
    }

    cols[2] = { ...cols[2], render: standardsColumnRender }

    cols[3] = { ...cols[3], render: maxScoreColumnRender }

    cols[4] = {
      ...cols[4],
      sorter: performanceColumnSorter,
      render: performanceColumnRender,
    }

    cols[5] = { ...cols[5], render: skipColumnRender }

    cols[6] = { ...cols[6], render: responseColumnRender }
    return cols
  }, [
    _columns,
    qLabelColumnSorter,
    qLabelColumnRender,
    standardsColumnRender,
    maxScoreColumnRender,
    performanceColumnSorter,
    performanceColumnRender,
    skipColumnRender,
    responseColumnRender,
  ])

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
        defaultExpandAllRows
        expandRowByClick
        indentSize={10}
      />
    </StyledCard>
  )
}

export default withNamespaces('reports')(ResponseFrequencyTable)
