import React from 'react'
import { Link } from 'react-router-dom'
import next from 'immer'

import { reportUtils } from '@edulastic/constants'

import { CustomTableTooltip } from '../../../../common/components/customTableTooltip'
import { ColoredCell } from '../../../../common/styled'
import TableTooltipRow from '../../../../common/components/tooltip/TableTooltipRow'
import { reportLinkColor } from '../../../multipleAssessmentReport/common/utils/constants'

const { getHSLFromRange1, filterAccordingToRole } = reportUtils.common

const { tableColumns, getDisplayValue } = reportUtils.performanceByStudents

// =====|=====|=====|=====| ================== |=====|=====|=====|===== //

// -----|-----|-----|-----| TABLE TRANSFORMERS |-----|-----|-----|----- //

// this will be consumed in /src/client/author/Shared/Components/ClassBreadCrumb.js
const getBreadCrumb = (location, pageTitle) => [
  {
    title: 'INSIGHTS',
    to: '/author/reports',
  },
  {
    title: pageTitle,
    to: `${location.pathname}${location.search}`,
  },
]

const getLinkToLCB = (data, record, location, pageTitle, style = {}) => (
  <Link
    style={style}
    to={{
      pathname: `/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${record.testActivityId}`,
      state: {
        breadCrumb: getBreadCrumb(location, pageTitle),
      },
    }}
  >
    {data}
  </Link>
)

const getCellContents = ({
  printData,
  colorKey,
  columnKey,
  record,
  location,
  pageTitle,
  isSharedReport,
}) => {
  if (columnKey === 'studentScore' && !isSharedReport) {
    const linkStyle = { color: reportLinkColor }
    return (
      <ColoredCell bgColor={getHSLFromRange1(parseInt(colorKey, 10))}>
        {getLinkToLCB(printData, record, location, pageTitle, linkStyle)}
      </ColoredCell>
    )
  }
  return (
    <div style={{ backgroundColor: getHSLFromRange1(parseInt(colorKey, 10)) }}>
      {printData}
    </div>
  )
}

const getColorCell = (
  columnKey,
  columnType,
  assessmentName,
  location = {},
  pageTitle,
  isSharedReport
) => (text, record) => {
  const toolTipText = (_record) => {
    let lastItem = {
      title: 'District: ',
      value: `${_record.districtAvg}%`,
    }
    switch (columnKey) {
      case 'schoolAvg':
        lastItem = {
          title: 'School: ',
          value: `${_record.schoolAvg}%`,
        }
        break
      case 'classAvg':
        lastItem = {
          title: 'Class: ',
          value: `${_record.classAvg}%`,
        }
        break
      default:
        break
    }
    return (
      <div>
        <TableTooltipRow title="Assessment Name: " value={assessmentName} />
        <TableTooltipRow title="Performance: " value={record.assessmentScore} />
        <TableTooltipRow
          title="Performance Band: "
          value={record.proficiencyBand}
        />
        <TableTooltipRow title="Student Name: " value={record.student} />
        <TableTooltipRow title="Class Name: " value={record.groupName} />
        <TableTooltipRow {...lastItem} />
      </div>
    )
  }

  const printData = text === 'Absent' ? text : getDisplayValue(columnType, text)

  return (
    <CustomTableTooltip
      printData={printData}
      colorKey={text}
      placement="top"
      title={toolTipText(record)}
      getCellContents={getCellContents}
      columnKey={columnKey}
      record={record}
      location={location}
      pageTitle={pageTitle}
      isSharedReport={isSharedReport}
    />
  )
}

export const getColumns = (
  assessmentName,
  role,
  location,
  pageTitle,
  isSharedReport,
  t
) => {
  const filteredColumns = filterAccordingToRole(tableColumns, role)
  const anonymousString = t('common.anonymous')

  return next(filteredColumns, (columnsDraft) => {
    columnsDraft.forEach((column) => {
      if (column.key === 'student') {
        column.render = (data, record) => {
          const _data = data || anonymousString
          return !isSharedReport &&
            (record.totalScore || record.totalScore === 0)
            ? getLinkToLCB(_data, record, location, pageTitle)
            : _data
        }
      } else if (column.key === 'assessmentScore') {
        column.render = (data, record) => {
          const linkStyle = { color: reportLinkColor }
          return !isSharedReport && data !== 'Absent'
            ? getLinkToLCB(data, record, location, pageTitle, linkStyle)
            : data
        }
      } else if (column.showToolTip) {
        column.render = getColorCell(
          column.dataIndex,
          column.type,
          assessmentName,
          location,
          pageTitle,
          isSharedReport
        )
      }
      if (column.sortable) {
        column.sorter = true
      }
    })
  })
}

// -----|-----|-----|-----| TABLE TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| ================== |=====|=====|=====|===== //
