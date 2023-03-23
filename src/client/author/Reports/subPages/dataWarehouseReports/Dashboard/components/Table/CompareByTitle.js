import { themeColor } from '@edulastic/colors'
import { Tooltip } from 'antd'
import { EduIf } from '@edulastic/common'
import { min } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import { DashedLine } from '../../../../../common/styled'
import { CompareByContainer } from '../common/styledComponents'
import { compareByKeys, tableFilterTypes } from '../../utils'

const CompareByTitle = ({ tableFilters, value, getTableDrillDownUrl }) => {
  const maxCharsInColumn = 25
  const dashedLineMarginX =
    96 - 3.5 * min([value.name?.length, maxCharsInColumn])

  const selectedCompareBy = tableFilters[tableFilterTypes.COMPARE_BY].key
  const url = getTableDrillDownUrl(value._id)

  const showLink = [
    compareByKeys.SCHOOL,
    compareByKeys.TEACHER,
    compareByKeys.CLASS,
  ].includes(selectedCompareBy)

  return value.name ? (
    <Tooltip title={value.name}>
      <EduIf condition={showLink}>
        <Link to={url} target="_blank">
          <div>
            <CompareByContainer>{value.name}</CompareByContainer>
            <DashedLine
              dashColor={themeColor}
              dashWidth="2px"
              margin={`4px ${dashedLineMarginX}px`}
              height="1.3px"
            />
          </div>
        </Link>
      </EduIf>
      <EduIf condition={!showLink}>
        <div>{value.name}</div>
      </EduIf>
    </Tooltip>
  ) : (
    '-'
  )
}

export default CompareByTitle
