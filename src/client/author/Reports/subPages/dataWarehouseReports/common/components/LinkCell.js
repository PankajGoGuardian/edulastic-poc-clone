import { Tooltip } from 'antd'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { Link } from 'react-router-dom'
import { CompareByContainer } from './styledComponents'

const LinkCell = ({ value, url, openNewTab = false }) => {
  const showLink = !!url
  const cellValue = value.name || '-'

  const linkProps = {
    target: openNewTab ? '_blank' : '_self',
    rel: openNewTab ? 'opener' : '',
  }

  return (
    <div>
      <EduIf condition={showLink}>
        <EduThen>
          <Tooltip title={value.name}>
            <Link to={url} {...linkProps}>
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
