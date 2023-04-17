import { EduIf } from '@edulastic/common'
import { IconExternalLink } from '@edulastic/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { WidgetHeaderWrapper } from './styledComponents'

const WidgetHeader = ({ title = '', url = null }) => {
  return (
    <WidgetHeaderWrapper>
      <div className="title">{title}</div>
      <EduIf condition={url}>
        <div>
          <Link to={url} target={url}>
            <IconExternalLink />
          </Link>
        </div>
      </EduIf>
    </WidgetHeaderWrapper>
  )
}

export default WidgetHeader
