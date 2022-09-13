import React from 'react'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'

import { IconInfo } from '@edulastic/icons'
import { lightGrey9 } from '@edulastic/colors'

import { Title } from '../Container/styled'
import DollarPremiumSymbol from '../../../../../AssignTest/components/Container/DollarPremiumSymbol'
import { settingTitleTestId } from './constants'

const SettingTitle = ({ title, tooltipTitle, premium }) => {
  return (
    <Title data-testid={settingTitleTestId}>
      <span>{title} </span>
      <DollarPremiumSymbol premium={premium} />
      <Tooltip title={tooltipTitle}>
        <IconInfo
          color={lightGrey9}
          style={{ marginLeft: '10px', cursor: 'pointer' }}
        />
      </Tooltip>
    </Title>
  )
}

SettingTitle.propTypes = {
  title: PropTypes.string.isRequired,
  premium: PropTypes.bool.isRequired,
  tooltipTitle: PropTypes.string.isRequired,
}

export default SettingTitle
