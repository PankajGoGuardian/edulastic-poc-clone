import { themeColor } from '@edulastic/colors'
import { Tooltip } from 'antd'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import { DashedLine } from '../../../../common/styled'
import { CompareByContainer } from './styledComponents'

const LinkCell = ({ value, url }) => {
  const showLink = !!url

  return (
    <EduIf condition={value.name}>
      <EduThen>
        <Tooltip title={value.name}>
          <EduIf condition={showLink}>
            <EduThen>
              <Link to={url} target={url}>
                <CompareByContainer>
                  <span className="dimension-name">{value.name}</span>
                  <DashedLine
                    dashColor={themeColor}
                    dashWidth="2px"
                    margin="4px 15px 0 15px"
                    height="1.3px"
                  />
                </CompareByContainer>
              </Link>
            </EduThen>
            <EduElse>
              <CompareByContainer>
                <span className="dimension-name">{value.name}</span>
              </CompareByContainer>
            </EduElse>
          </EduIf>
        </Tooltip>
      </EduThen>
      <EduElse>-</EduElse>
    </EduIf>
  )
}

export default LinkCell
