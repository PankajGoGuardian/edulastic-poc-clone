import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { isNaN } from 'lodash'
import { EduIf, FlexContainer, Stimulus } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { TEST_TYPE_SURVEY } from '@edulastic/constants/const/testTypes'
import { StyledCard, StyledIconInfo, StyledTable } from '../styled'
import PrintableTable from '../../../../../common/components/tables/PrintableTable'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { ResponseColumn } from './ResponseColumn'
import { PerformanceColumn } from './PerformanceColumn'
import { NOT_AVAILABLE_LABEL, onCsvConvert } from '../../utils'
import { CustomWhiteBackgroundTooltip } from '../../../../../common/components/customTableTooltip'
import { StyledText } from '../../../../../common/styled'

const ResponseFrequencyTable = ({
  columns: _columns,
  assessment,
  isCsvDownloading,
  isPrinting,
  data: dataSource,
  correctThreshold,
  incorrectFrequencyThreshold,
  isSharedReport,
  testTypesAllowed,
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
    questionColumnRender,
  ] = useMemo(() => {
    const _qLabelColumnSorter = (a, b) =>
      Number(a.qLabel.substring(1)) - Number(b.qLabel.substring(1))

    const _standardsColumnRender = (data) => (
      <FlexContainer flexWrap="wrap" justifyContent="center">
        {data.map(({ identifier = '-', description = '' }, idx) => {
          const isLastItem = idx === data.length - 1
          return (
            <CustomWhiteBackgroundTooltip
              key={identifier}
              data={description}
              str={
                <StyledText $fontWeight="bold" $fontSize="14px">
                  {`${identifier}${isLastItem ? ' ' : ','}`}
                </StyledText>
              }
            />
          )
        })}
      </FlexContainer>
    )

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

    const _questionRender = (data) => {
      return <Stimulus dangerouslySetInnerHTML={{ __html: data }} />
    }

    return [
      _qLabelColumnSorter,
      _standardsColumnRender,
      _performanceColumnSorter,
      _skipColumnRender,
      _questionRender,
    ]
  }, [])

  const qLabelColumnRender = useCallback(
    (text, record) => {
      const { pathname, search } = window.location
      const { assignmentId, groupId, questionId } = record
      return isSharedReport ? (
        text
      ) : (
        <Link
          to={{
            pathname: `/author/classboard/${assignmentId}/${groupId}/question-activity/${questionId}`,
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
        testTypesAllowed={testTypesAllowed}
      />
    ),
    [incorrectFrequencyThreshold, isPrinting]
  )

  const columns = useMemo(() => {
    return _columns.map((col) => {
      const updatedColumn = { ...col }
      switch (updatedColumn.key) {
        case 'qLabel': {
          updatedColumn.sorter = qLabelColumnSorter
          updatedColumn.render = qLabelColumnRender
          if (testTypesAllowed === TEST_TYPE_SURVEY) {
            delete updatedColumn.fixed
          }
          break
        }
        case 'qType': {
          if (testTypesAllowed === TEST_TYPE_SURVEY) {
            updatedColumn.title = 'Question'
            updatedColumn.dataIndex = 'stimulus'
            updatedColumn.key = 'stimulus'
            updatedColumn.width = 200
            updatedColumn.align = 'left'
            updatedColumn.render = questionColumnRender
          }
          break
        }
        case 'standards': {
          updatedColumn.render = standardsColumnRender
          break
        }
        case 'maxScore': {
          updatedColumn.render = maxScoreColumnRender
          break
        }
        case 'total_score': {
          updatedColumn.sorter = performanceColumnSorter
          updatedColumn.render = performanceColumnRender
          break
        }
        case 'skip_cnt': {
          updatedColumn.render = skipColumnRender
          break
        }
        case 'resp_cnts': {
          updatedColumn.render = responseColumnRender
          break
        }
        default:
      }
      return updatedColumn
    })
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
        isSurveyTest={testTypesAllowed === TEST_TYPE_SURVEY}
      />
    </StyledCard>
  )
}

export default withNamespaces('reports')(ResponseFrequencyTable)
