import React from 'react'
import { connect } from 'react-redux'
import { SettingsRow, Container, Label, Wrapper } from './styled'
import ToggleSwitch from '../../../ToggleSwitch'
import { updateSettingsAction } from '../../../../reducers/ducks/settings'
import IconBell from './icons/Bell'
import IconBellSlash from './icons/BellSlash'
import IconUnMute from './icons/UnMute'
import IconMute from './icons/Mute'
import IconSwitchRole from './icons/SwitchRole'
import IconEngagement from './icons/Engagement'

const TeacherSettings = ({
  notifications,
  muteAll,
  engagementTracking,
  updateSettings,
}) => {
  const handleMuteAll = (value) => {
    chrome.runtime.sendMessage(
      'eadjoeopijphkogdmabgffpiiebjdgoo',
      { type: 'MUTE_ALL' },
      (response) => {
        console.log('Mute All Response - ', response)
        if (response) updateSettings({ muteAll: value })
      }
    )
  }

  return (
    <Container>
      <SettingsRow>
        <Wrapper>
          {!notifications ? <IconBell /> : <IconBellSlash />}
          <Label>Turn Off Notifications</Label>
        </Wrapper>
        <ToggleSwitch
          checked={notifications}
          onChange={(value) => updateSettings({ notifications: value })}
        />
      </SettingsRow>

      <SettingsRow>
        <Wrapper>
          {muteAll ? <IconMute /> : <IconUnMute />}
          <Label>Mute All</Label>
        </Wrapper>
        <ToggleSwitch checked={muteAll} onChange={handleMuteAll} />
      </SettingsRow>

      <SettingsRow>
        <Wrapper clickable onClick={() => console.log('SwitchRole')}>
          <IconSwitchRole />
          <Label>Switch Role</Label>
        </Wrapper>
      </SettingsRow>

      <SettingsRow>
        <Wrapper>
          <IconEngagement />
          <Label>Engagement Tracking</Label>
        </Wrapper>
        <ToggleSwitch
          checked={engagementTracking}
          onChange={(value) => updateSettings({ engagementTracking: value })}
        />
      </SettingsRow>
    </Container>
  )
}

export default connect(
  (state) => ({
    notifications: state.settingsReducer.notifications,
    muteAll: state.settingsReducer.muteAll,
    engagementTracking: state.settingsReducer.engagementTracking,
  }),
  {
    updateSettings: updateSettingsAction,
  }
)(TeacherSettings)
