import { EduIf } from '@edulastic/common'
import { IconExternalLink } from '@edulastic/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { WidgetHeaderWrapper } from '../../common/styledComponents'

const WidgetHeader = ({ title, url = null }) => {
  return (
    <WidgetHeaderWrapper>
      <span className="title">{title}</span>
      <EduIf condition={url}>
        <span className="external-link">
          <Link to={url} target={url}>
            <IconExternalLink />
          </Link>
        </span>
      </EduIf>
    </WidgetHeaderWrapper>
  )
}

export default WidgetHeader
