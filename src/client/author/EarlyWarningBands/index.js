import React from 'react'
import AdminHeader from '../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../src/components/common/AdminSubHeader/SettingSubHeader'

import {
  StyledContent,
  StyledLayout,
  SettingsWrapper,
} from '../../admin/Common/StyledComponents/settingsContent'
import { title, menuActive } from './utils'
import SectionLabel from '../Reports/common/components/SectionLabel'
import SectionDescription from '../Reports/common/components/SectionDescription'

function EarlyWarningBands({ history }) {
  return (
    <SettingsWrapper>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout>
          <AdminSubHeader active={menuActive} history={history} />
          <SectionLabel
            style={{ fontSize: '18px' }}
            $margin="30px 0px 5px 0px"
            showHelp={false}
          >
            Risk Bands
          </SectionLabel>
          <SectionDescription $margin="0px 0px 30px 0px">
            These are the current risk indicators you’ve set for specific grades
          </SectionDescription>
        </StyledLayout>
      </StyledContent>
    </SettingsWrapper>
  )
}

export default EarlyWarningBands
