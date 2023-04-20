import { EduIf } from '@edulastic/common'
import { IconExternalLink } from '@edulastic/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { WidgetHeaderWrapper } from './styledComponents'
import { Spacer } from '../../../../../../common/styled'

const WidgetHeader = ({ title = '', url = null, children }) => {
  return (
    <WidgetHeaderWrapper>
      <div className="title">{title}</div>
      {children}
      <EduIf condition={url}>
        <Spacer />
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
