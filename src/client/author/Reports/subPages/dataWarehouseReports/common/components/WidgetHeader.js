import { EduIf } from '@edulastic/common'
import { IconExternalLink } from '@edulastic/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { StyledText, WidgetHeaderWrapper } from './styledComponents'

const WidgetHeader = ({
  title = '',
  url = null,
  date = '',
  loading = false,
}) => {
  const showDateLabel = !loading && date !== 'Invalid date'
  return (
    <WidgetHeaderWrapper>
      <div className="title">{title}</div>
      <EduIf condition={showDateLabel}>
        <StyledText margin="0 0 0 20px">{date}</StyledText>
      </EduIf>
      <EduIf condition={url}>
        <div className="external-link">
          <Link to={url} target={url}>
            <IconExternalLink />
          </Link>
        </div>
      </EduIf>
    </WidgetHeaderWrapper>
  )
}

export default WidgetHeader
