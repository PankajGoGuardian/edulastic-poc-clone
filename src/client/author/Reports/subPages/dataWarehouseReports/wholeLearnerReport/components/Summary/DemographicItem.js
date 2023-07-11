import { greyThemeDark2, themeColor } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import { IconCheckMark } from '@edulastic/icons'
import { Icon } from 'antd'
import React from 'react'

const DemographicItem = ({ type, value }) => {
  return (
    <EduIf condition={!!type}>
      <div className="demographic-item">
        {['yes', 'y'].includes(type?.toLowerCase()) ? (
          <IconCheckMark color={themeColor} />
        ) : (
          <Icon
            type="close-circle"
            theme="filled"
            style={{ color: greyThemeDark2 }}
          />
        )}
        <span>{value}</span>
      </div>
    </EduIf>
  )
}

export default DemographicItem
