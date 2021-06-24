import React, { useState, useMemo } from 'react'
import { Row, Col } from 'antd'
import { groupBy, uniqBy, capitalize } from 'lodash'
import next from 'immer'
import qs from 'qs'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { StyledTable } from '../styled'

import {
  getStandardDeviation,
  getVariance,
  downloadCSV,
  formatDate,
} from '../../../../../common/util'
import { StyledH3, StyledDropDownContainer } from '../../../../../common/styled'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import PrintableTable from '../../../../../common/components/tables/PrintableTable'
import CsvTable from '../../../../../common/components/tables/CsvTable'

import columnData from '../../static/json/tableColumns.json'

const AssessmentStatisticTable = (props) => {
  const [tableType, setTableType] = useState({
    key: 'school',
    title: 'School',
  })
  const { data, role, name, isCsvDownloading, isPrinting, location } = props

  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const { cliUser } = query

  if (role === 'teacher' && tableType.key !== 'class') {
    const o = { key: 'class', title: 'Class' }
    setTableType(o)
  }

  const updateTable = (type, _data) => {
    let hMap
    if (type === 'school') {
      hMap = groupBy(_data, 'schoolId')
    } else if (type === 'teacher') {
      hMap = groupBy(_data, 'teacherId')
    } else if (type === 'class') {
      hMap = groupBy(_data, (o) => `${o.assignmentId}_${o.groupId}`)
    }

    const arr = Object.keys(hMap).map((key) => {
      const __data = uniqBy(hMap[key], (o) => `${o.assignmentId}_${o.groupId}`)
      const obj = { ...__data[0], key }

      let maxAssessmentDate = 0
      let maxDueDate = 0
      let sumTotalScore = 0
      let sumTotalMaxScore = 0
      let sumStudentsAbsent = 0
      let sumStudentsAssigned = 0
      let sumStudentsGraded = 0
      let minScore = Infinity
      let maxScore = -Infinity
      let concatScores = []

      for (const item of __data) {
        const {
          totalScore = 0,
          totalMaxScore = 0,
          assessmentDate,
          dueDate,
          studentsAbsent,
          studentsAssigned,
          studentsGraded,
          minScore: _minScore,
          maxScore: _maxScore,
          scores,
        } = item

        sumTotalScore += totalScore
        sumTotalMaxScore += totalMaxScore

        if (maxAssessmentDate < assessmentDate)
          maxAssessmentDate = assessmentDate

        if (maxDueDate < dueDate) maxDueDate = dueDate

        sumStudentsAbsent += studentsAbsent
        sumStudentsAssigned += studentsAssigned
        sumStudentsGraded += studentsGraded
        minScore = Math.min(_minScore, minScore)
        maxScore = Math.max(_maxScore, maxScore)

        concatScores = concatScores.concat(scores)
      }

      const scoreVariance = concatScores.length ? getVariance(concatScores) : 0
      let avgStudentScore = 0
      if (sumTotalMaxScore) {
        avgStudentScore = Number(
          ((sumTotalScore / sumTotalMaxScore) * 100).toFixed(0)
        )
      }
      let avgScore = 0
      if (sumTotalScore) {
        avgScore = (sumTotalScore / sumStudentsGraded || 0).toFixed(2)
      }

      const result = {
        ...obj,
        avgStudentScore,
        scoreVariance: scoreVariance.toFixed(2),
        scoreStdDeviation: getStandardDeviation(scoreVariance).toFixed(2),
        avgScore,
        assessmentDate: formatDate(maxAssessmentDate, true),
        dueDate: formatDate(maxDueDate, true),
        studentsAbsent: sumStudentsAbsent,
        studentsAssigned: sumStudentsAssigned,
        studentsGraded: sumStudentsGraded,
        minScore: minScore.toFixed(2),
        maxScore: maxScore.toFixed(2),
      }

      return result
    })
    return arr
  }

  const sortAlphabets = (key) => (a, b) => {
    if (a[key] < b[key]) {
      return -1
    }
    if (a[key] > b[key]) {
      return 1
    }
    return 0
  }

  const sortNumbers = (key) => (a, b) => {
    const _a = a[key] || 0
    const _b = b[key] || 0
    return _a - _b
  }

  const getColumns = (_tableType) =>
    next([...columnData[_tableType.key].columns], (columns) => {
      columns[0].render = (text) => text || '-'
      if (role === 'teacher') {
        columns?.splice(0, 1)
        cliUser && columns.splice(2, 1)
        columns[0].sorter = sortAlphabets('groupName')
      } else {
        columns[0].sorter = sortAlphabets('schoolId')
      }

      if (_tableType.key === 'school' || role === 'teacher') {
        columns[6].sorter = sortNumbers('avgStudentScore')
        columns[6].render = (text) => `${text}%`
      } else {
        columns[7].sorter = sortNumbers('avgStudentScore')
        columns[7].render = (text) => `${text}%`
      }
    })

  const table = useMemo(() => {
    if (data) {
      let tt = tableType
      if (role === 'teacher') {
        const o = { key: 'class', title: 'Class' }
        tt = o
      }
      return {
        columns: getColumns(tt),
        tableData: updateTable(tt.key, data),
      }
    }
    return {
      columns: [],
      tableData: [],
    }
  }, [data, tableType])

  const updateTableCB = (event, selected) => {
    setTableType(selected)
  }

  const onCsvConvert = (_data) =>
    downloadCSV(`${tableType.title} Level Performance Report.csv`, _data)

  const dropDownData = [
    { key: 'school', title: 'School' },
    { key: 'teacher', title: 'Teacher' },
    { key: 'class', title: 'Class' },
  ]

  return (
    <>
      <Row type="flex" gutter={[5, 10]} justify="start">
        <Col xs={24} sm={12} md={16} lg={18} xl={20}>
          <StyledH3>
            Assignment Statistics for {name} by {capitalize(tableType.title)}
          </StyledH3>
        </Col>
        {role !== 'teacher' && (
          <StyledDropDownContainer
            data-cy="compareBy"
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4}
          >
            <ControlDropDown
              prefix="Compare by"
              by={tableType}
              selectCB={updateTableCB}
              data={dropDownData}
              isPageFilter
            />
          </StyledDropDownContainer>
        )}
      </Row>
      <Row>
        <CsvTable
          isPrinting={isPrinting}
          component={StyledTable}
          columns={table.columns}
          dataSource={table.tableData}
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
          tableToRender={PrintableTable}
          scroll={{ x: '100%' }}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 10,
          }}
        />
      </Row>
    </>
  )
}

const enhance = compose(withRouter)

export default enhance(AssessmentStatisticTable)
