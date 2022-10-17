import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import DataExport from '../SubContainer/DataExport'
import RosterHistory from '../SubContainer/RosterHistory'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/SettingSubHeader'
import { StyledContent } from '../../../../admin/Common/StyledComponents/settingsContent'
import {
  CustomStyledLayout,
  CustomSettingsWrapper,
  StyledSpincontainer,
} from './styled'
import { StyledSpin } from '../../../../admin/Common/StyledComponents'
import { receiveRosterLogAction } from '../../duck'
const title = 'Manage District'
const RosterImport = (props) => {
  const { history, loading, rosterImportLog, loadRosterLogs } = props
  const menuActive = { mainMenu: 'Settings', subMenu: 'Roster Import' }
  const showSpin = loading
  useEffect(() => {
    loadRosterLogs()
  }, [])
  return (
    <>
      <CustomSettingsWrapper>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <AdminSubHeader active={menuActive} history={history} />
          {showSpin && (
            <StyledSpincontainer>
              <StyledSpin size="large" />
            </StyledSpincontainer>
          )}
          {!loading && (
            <>
              <CustomStyledLayout>
                <DataExport />
              </CustomStyledLayout>
              <CustomStyledLayout>
                <RosterHistory rosterImportLog={rosterImportLog} />
              </CustomStyledLayout>
            </>
          )}
        </StyledContent>
      </CustomSettingsWrapper>
    </>
  )
}

//export default RosterImport

export default connect(
  (state) => ({
    loading: get(state, ['rosterImportReducer', 'loading'], false),
    rosterImportLog: get(state, ['rosterImportReducer', 'rosterImportLog'], []),
  }),
  { loadRosterLogs: receiveRosterLogAction }
)(RosterImport)
