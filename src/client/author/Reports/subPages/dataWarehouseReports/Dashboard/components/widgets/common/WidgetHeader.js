import { IconExternalLink } from '@edulastic/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { DW_DASHBOARD_URL } from '../../../../../../common/constants/dataWarehouseReports'

const WidgetHeader = ({ title, url = { DW_DASHBOARD_URL } }) => {
  return (
    <div>
      <span className="title">{title}</span>
      <span className="external-link">
        <Link to={url} target="_blank">
          <IconExternalLink />
        </Link>
      </span>
    </div>
  )
}

export default WidgetHeader
