import { IconExternalLink } from '@edulastic/icons'
import React from 'react'
// import { Link } from 'react-router-dom'

const WidgetHeader = ({ title /* link */ }) => {
  return (
    <div>
      <span className="title">{title}</span>
      <span className="external-link">
        {/* <Link to={link}> */}
        <IconExternalLink />
        {/* </Link> */}
      </span>
    </div>
  )
}

export default WidgetHeader
