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
        <EduIf condition={!React.Children.count(children)}>
          <Spacer />
        </EduIf>
        <div>
          <Link to={url} target={url}>
            <IconExternalLink style={{ margin: 'auto 20px' }} />
          </Link>
        </div>
      </EduIf>
    </WidgetHeaderWrapper>
  )
}

export default WidgetHeader
