import { Tooltip } from 'antd'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import { CompareByContainer } from './styledComponents'

const LinkCell = ({ value, url, openNewTab = false }) => {
  const showLink = !!url
  const cellValue = value.name || '-'
  const target = openNewTab ? '_black' : '_self'

  return (
    <div>
      <EduIf condition={showLink}>
        <EduThen>
          <Tooltip title={value.name}>
            <Link to={url} target={target}>
              <CompareByContainer>{cellValue}</CompareByContainer>
            </Link>
          </Tooltip>
        </EduThen>
        <EduElse>
          <Tooltip title={value.name}>
            <CompareByContainer>{cellValue}</CompareByContainer>
          </Tooltip>
        </EduElse>
      </EduIf>
    </div>
  )
}

export default LinkCell
