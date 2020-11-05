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
const fixedHash = <span style={fixedStyle}>#</span>,
  fixedStar = <span style={fixedStyle}>*</span>

// column[0] = question,
// column[1] = yourAnswer
// column[2] = correctAnswer
// column[3] = score
// column[4] = maxScore
const columnsBase = next(tableColumnsData.questionTable, (arr) => {
  arr[0].render = (data, record, index) => {
    return <StyledCheck record={record}>{data}</StyledCheck>
  }
  arr[1].render = (data, record, index) => {
    return data.map((yAnswer) => {
      let content = yAnswer,
        fixedContent = null
      if (yAnswer === 'TEI') {
        fixedContent = fixedHash
      } else if (yAnswer === 'Constructed Response') {
        fixedContent = fixedStar
      }
      return fixedContent ? (
        fixedContent
      ) : (
        <MathFormulaDisplay
          style={{ marginBottom: '10px', minHeight: '22px' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    })
  }
  arr[2].render = (data, record, index) => {
    return data.map((cAnswer) => {
      let content = cAnswer,
        fixedContent = null
      if (cAnswer === 'TEI') {
        fixedContent = fixedHash
      } else if (cAnswer === 'Constructed Response') {
        fixedContent = fixedStar
      }
      return fixedContent ? (
        fixedContent
      ) : (
        <MathFormulaDisplay
          style={{ marginBottom: '10px', minHeight: '22px' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    })
  }
})

export function QuestionTableContainer(props) {
  const { dataSource, columnsFlags } = props

  // this is checking which columns to display/hide
  const columns = useMemo(() => {
    return columnsBase.filter((item, index) => {
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
