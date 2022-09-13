import React from 'react'
import PropTypes from 'prop-types'
import { Body, Description } from '../Container/styled'
import { settingDescriptionTestId } from './constants'

const SettingDescription = ({
  description,
  isSmallSize,
  padding,
  marginTop,
}) => {
  return (
    <Body smallSize={isSmallSize} padding={padding}>
      <Description marginTop={marginTop} data-testid={settingDescriptionTestId}>
        {description}
      </Description>
    </Body>
  )
}

SettingDescription.propTypes = {
  description: PropTypes.string.isRequired,
  isSmallSize: PropTypes.number,
  padding: PropTypes.string,
  marginTop: PropTypes.string,
}

SettingDescription.defaultProps = {
  isSmallSize: 1,
  padding: '20px 0px',
  marginTop: '10px',
}

export default SettingDescription
