import React from 'react'
import PropTypes from 'prop-types'

import { SettingContainer } from '../../../../../../AssignTest/components/Container/styled'
import { Title, Block } from '../styled'
import SettingTitle from '../../Common/SettingTitle'
import SwitchButton from '../../Common/SwitchButton'
import SettingDescription from '../../Common/SettingDescription'

const ShowTtsForPassage = ({
  showTtsForPassages,
  isSmallSize,
  disabled,
  isDocBased,
  updateTestData,
  isTestlet,
  premium,
  i18translate,
}) => {
  if (isDocBased || isTestlet) {
    return null
  }

  const updateShowTtsForPassage = (value) => {
    updateTestData('showTtsForPassages')(value)
  }
  const isDisabled = disabled || !premium

  return (
    <Block id="show-tts-for-passage" smallSize={isSmallSize}>
      <SettingContainer>
        <Title>
          <SettingTitle
            title={i18translate('showTtsForPassage.title')}
            tooltipTitle={i18translate('showTtsForPassage.info')}
            premium={premium}
          />
          <SwitchButton
            disabled={isDisabled}
            checked={showTtsForPassages}
            onChangeHandler={updateShowTtsForPassage}
            switchTextYesNo
          />
        </Title>
        <SettingDescription
          isSmallSize={isSmallSize}
          description={i18translate('showTtsForPassage.info')}
        />
      </SettingContainer>
    </Block>
  )
}

ShowTtsForPassage.propTypes = {
  showTtsForPassages: PropTypes.bool.isRequired,
  isSmallSize: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  isDocBased: PropTypes.bool.isRequired,
  updateTestData: PropTypes.func.isRequired,
  isTestlet: PropTypes.bool.isRequired,
  premium: PropTypes.bool.isRequired,
  i18translate: PropTypes.func.isRequired,
}

export default ShowTtsForPassage
