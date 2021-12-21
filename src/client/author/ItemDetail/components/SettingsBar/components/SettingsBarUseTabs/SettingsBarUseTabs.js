import React from 'react'
import { FlexContainer, CheckboxLabel } from '@edulastic/common'
import PropTypes from 'prop-types'
import { withNamespaces } from '@edulastic/localization'
import { Container, Heading } from './styled'
import HelperToolTip from '../../../../../../assessment/components/EvaluationSettings/components/HelperToolTip'

const SettingsBarUseTabs = ({
  onChangeLeft,
  onChangeRight,
  checkedLeft,
  checkedRight,
  t,
  disableRight,
}) => (
  <Container>
    <FlexContainer justifyContent="flex-start">
      <Heading data-cy="useTabs">{t('component.settingsBar.useTabs')}</Heading>
      <HelperToolTip
        optionKey="useTabs"
        placement="topLeft"
        isMultipartSetting
      />
    </FlexContainer>
    <FlexContainer justifyContent="space-between">
      <CheckboxLabel
        onChange={onChangeLeft}
        checked={checkedLeft}
        data-cy="leftColumn"
      >
        {t('component.settingsBar.leftColumn')}
      </CheckboxLabel>
      <CheckboxLabel
        onChange={onChangeRight}
        checked={checkedRight}
        disabled={disableRight}
        data-cy="rightColumn"
      >
        {t('component.settingsBar.rightColumn')}
      </CheckboxLabel>
    </FlexContainer>
  </Container>
)

SettingsBarUseTabs.propTypes = {
  onChangeLeft: PropTypes.func.isRequired,
  onChangeRight: PropTypes.func.isRequired,
  checkedLeft: PropTypes.bool.isRequired,
  disableRight: PropTypes.bool.isRequired,
  checkedRight: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces('author')(SettingsBarUseTabs)
