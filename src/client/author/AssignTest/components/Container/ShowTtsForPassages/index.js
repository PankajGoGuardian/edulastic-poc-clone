import React from 'react'
import PropTypes from 'prop-types'
import { Col } from 'antd'

import { StyledRow, Label } from '../../SimpleOptions/styled'
import SwitchButton from '../../../../TestPage/components/Setting/components/Common/SwitchButton'
import DollarPremiumSymbol from '../DollarPremiumSymbol'

const ShowTtsForPassage = ({
  freezeSettings,
  showTtsForPassages,
  overRideSettings,
  premium,
  i18translate,
}) => {
  const isDisabled = freezeSettings || !premium

  return (
    <StyledRow
      data-cy="show-tts-for-passage-container"
      gutter={16}
      mb="15px"
      height="40"
    >
      <Col span={10}>
        <Label>
          <span>{i18translate('showTtsForPassage.title')}</span>
          <DollarPremiumSymbol premium={premium} />
        </Label>
      </Col>
      <Col span={10}>
        <SwitchButton
          disabled={isDisabled}
          checked={showTtsForPassages}
          onChangeHandler={(value) =>
            overRideSettings('showTtsForPassages', value)
          }
        />
      </Col>
    </StyledRow>
  )
}

ShowTtsForPassage.propTypes = {
  freezeSettings: PropTypes.bool.isRequired,
  showTtsForPassages: PropTypes.bool.isRequired,
  overRideSettings: PropTypes.func.isRequired,
  premium: PropTypes.bool.isRequired,
}

export default ShowTtsForPassage
