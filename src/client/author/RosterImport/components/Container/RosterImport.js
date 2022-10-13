import React, { useEffect } from 'react'
import DataExport from '../SubContainer/DataExport'
import RosterHistory from '../SubContainer/RosterHistory'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/SettingSubHeader'
import { StyledContent } from '../../../../admin/Common/StyledComponents/settingsContent'
import { CustomStyledLayout, CustomSettingsWrapper } from './styled'

const title = 'Manage District'
const RosterImport = ({ history }) => {
  const menuActive = { mainMenu: 'Settings', subMenu: 'Roster Import' }

  return (
    <>
      <CustomSettingsWrapper>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <AdminSubHeader active={menuActive} history={history} />
          <CustomStyledLayout loading="false">
            <DataExport />
          </CustomStyledLayout>
          <RosterHistory />
        </StyledContent>
      </CustomSettingsWrapper>
    </>
  )
}

export default RosterImport
