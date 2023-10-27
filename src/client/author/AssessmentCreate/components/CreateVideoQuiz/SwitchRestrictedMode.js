import React, { useEffect, useState } from 'react'
import Row from 'antd/lib/row'
import Tooltip from 'antd/lib/tooltip'
import { IconInfo } from '@edulastic/icons'
import { videoContentRestrictionTypes } from '@edulastic/constants/const/test'
import { EduSwitchStyled } from '@edulastic/common'

const SwitchRestrictedMode = ({
  handleChange,
  value = videoContentRestrictionTypes.STRICT,
}) => {
  const [isModerateRestriction, setIsModerateRestriction] = useState(
    value === videoContentRestrictionTypes.MODERATE
  )

  useEffect(() => {
    const videoContentRestriction = isModerateRestriction
      ? videoContentRestrictionTypes.MODERATE
      : videoContentRestrictionTypes.STRICT
    handleChange('videoContentRestriction', videoContentRestriction)
  }, [isModerateRestriction])

  return (
    <Row
      type="flex"
      align="middle"
      justify="space-between"
      style={{ marginBottom: 20 }}
    >
      <Row type="flex" align="middle" gutter={[5, 0]}>
        <span style={{ marginRight: 5 }}>
          Switch to Moderate Restricted Mode{' '}
        </span>
        <Tooltip
          title="Youtube has a restrict mode setting that is set to Strict by default which may restrict to play videos that show potentially adult content."
          placement="bottom"
        >
          <IconInfo />
        </Tooltip>
      </Row>
      <Row type="flex" align="middle">
        <Tooltip
          title={
            isModerateRestriction
              ? 'Restricted mode: Moderate'
              : 'Restricted mode: Strict'
          }
          placement="bottom"
        >
          <EduSwitchStyled
            checked={isModerateRestriction}
            onChange={(checked) => setIsModerateRestriction(checked)}
          />
        </Tooltip>
      </Row>
    </Row>
  )
}

export default SwitchRestrictedMode
