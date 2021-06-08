import React, { useMemo } from 'react'
import next from 'immer'
import styled from 'styled-components'
import { Icon } from 'antd'
import { MathFormulaDisplay } from '@edulastic/common'
import { StyledTable } from './styles'
import tableColumnsData from '../utils/tableColumnData.json'

const Check = (props) => {
  const {
    className,
    children,
    record: { correct, partialCorrect },
  } = props
  let IconComponent = <Icon type="close" style={{ color: 'red' }} />
  if (correct) {
    IconComponent = <Icon type="check" style={{ color: 'green' }} />
  } else if (partialCorrect) {
    IconComponent = <Icon type="check" style={{ color: 'orange' }} />
  }

  return (
    <span className={className}>
      {children}
      {IconComponent}
    </span>
  )
}

const StyledCheck = styled(Check)`
  i {
    margin-left: 29px;
  }
`
const fixedStyle = { 'font-size': 16, 'font-weight': 500 }
const fixedHash = <span style={fixedStyle}>#</span>
const fixedStar = <span style={fixedStyle}>*</span>

// column[0] = question,
// column[1] = yourAnswer
// column[2] = correctAnswer
// column[3] = score
// column[4] = maxScore
const columnsBase = next(tableColumnsData.questionTable, (arr) => {
  arr[0].render = (data, record) => {
    return <StyledCheck record={record}>{data}</StyledCheck>
  }
  arr[1].render = (data, record) => {
    const multipartItemLevel = record.itemLevelScoring && data.length > 1
    if (multipartItemLevel) {
      return fixedHash
    }
    return data.map((yAnswer) => {
      const content = yAnswer
      let fixedContent = null
      if (yAnswer === 'TEI') {
        fixedContent = fixedHash
      } else if (yAnswer === 'Constructed Response') {
        fixedContent = fixedStar
      }
      return (
        fixedContent || (
          <MathFormulaDisplay
            style={{ marginBottom: '10px', minHeight: '22px' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )
      )
    })
  }
  arr[2].render = (data, record) => {
    const multipartItemLevel = record.itemLevelScoring && data.length > 1
    if (multipartItemLevel) {
      return fixedHash
    }
    return data.map((cAnswer) => {
      const content = cAnswer
      let fixedContent = null
      if (cAnswer === 'TEI') {
        fixedContent = fixedHash
      } else if (cAnswer === 'Constructed Response') {
        fixedContent = fixedStar
      }
      return (
        fixedContent || (
          <MathFormulaDisplay
            style={{ marginBottom: '10px', minHeight: '22px' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )
      )
    })
  }
})

export function QuestionTableContainer(props) {
  const { dataSource, columnsFlags } = props

  dataSource.forEach((data) => {
    const { validation, maxScore } = data
    if (validation && validation.unscored && maxScore === 0) {
      data.score = 'Unscored'
      data.maxScore = 'Unscored'
    }
  })

  // this is checking which columns to display/hide
  const columns = useMemo(() => {
    return columnsBase.filter((item) => {
      if (
        !columnsFlags.questionPerformance &&
        ['score', 'maxScore'].includes(item.key)
      ) {
        return false
      }

      if (!columnsFlags.studentResponse && item.key === 'yourAnswer') {
        return false
      }

      if (!columnsFlags.correctAnswer && item.key === 'correctAnswer') {
        return false
      }
      return true
    })
  }, [
    !!columnsFlags.questionPerformance,
    !!columnsFlags.correctAnswer,
    !!columnsFlags.studentResponse,
  ])

  return (
    <StyledTable
      data-cy="report-question-table"
      columns={columns}
      dataSource={dataSource}
      rowKey="_id"
      pagination={false}
    />
  )
}
