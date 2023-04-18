import { themeColor } from '@edulastic/colors'
import { Tooltip } from 'antd'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import { DashedLine } from '../../../../common/styled'
import { CompareByContainer } from './styledComponents'
import { compareByKeys } from '../utils'

const CompareByTitle = ({ selectedCompareBy, value, getTableDrillDownUrl }) => {
  const url = getTableDrillDownUrl(value._id)

  const showLink = [
    compareByKeys.SCHOOL,
    compareByKeys.TEACHER,
    compareByKeys.CLASS,
  ].includes(selectedCompareBy)

  return (
    <EduIf condition={value.name}>
      <EduThen>
        <EduIf condition={showLink}>
          <EduThen>
            <Tooltip title={value.name}>
              <Link to={url} target={url}>
                <CompareByContainer>
                  <div className="dimension-name">{value.name}</div>
                  <DashedLine
                    dashColor={themeColor}
                    dashWidth="2px"
                    margin="4px 15px 0 15px"
                    height="1.3px"
                  />
                </CompareByContainer>
              </Link>
            </Tooltip>
          </EduThen>
          <EduElse>
            <Tooltip title={value.name}>
              <div>{value.name}</div>
            </Tooltip>
          </EduElse>
        </EduIf>
      </EduThen>
      <EduElse>-</EduElse>
    </EduIf>
  )
}

export default CompareByTitle
