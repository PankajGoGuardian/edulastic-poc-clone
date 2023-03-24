import { IconExternalLink } from '@edulastic/icons'
import React from 'react'
import { Link } from 'react-router-dom'

const WidgetHeader = ({ title, url }) => {
  return (
    <div>
      <span className="title">{title}</span>
      {url && (
        <span className="external-link">
          <Link to={url} target="_blank">
            <IconExternalLink />
          </Link>
        </span>
      )}
    </div>
  )
}

export default WidgetHeader
